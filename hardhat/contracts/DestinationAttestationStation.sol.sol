// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import {IXReceiver} from "@connext/interfaces/core/IXReceiver.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Semver} from "@eth-optimism/contracts-bedrock/contracts/universal/Semver.sol";

/**
 * @title DestinationGreeter
 * @notice Example destination contract that stores a greeting.
 */
contract DestinationAttestationStation is IXReceiver, Semver {
    // The token to be paid on this domain
    IERC20 public immutable token;

    constructor(address _token) Semver(1, 1, 0) {
        token = IERC20(_token);
    }

    mapping(address => mapping(address => mapping(bytes32 => bytes)))
        public attestations;
    // Creator -> key -> val -> amount (to be paid) (if zero, creator opter out)
    mapping(address => mapping(bytes32 => mapping(bytes => uint256)))
        public autoAttestations;

    event AutoAttestationAllowed(
        address indexed creator,
        bytes32 indexed key,
        bytes val,
        uint256 amount
    );
    event AutoAttestationCreated(
        address indexed creator,
        address indexed about,
        bytes32 indexed key,
        bytes val
    );

    event AttestationCreatedData(
        address indexed creator,
        address indexed about,
        bytes32 indexed key,
        bytes val
    );

    struct AutoAttestationData {
        address creator;
        address about;
        bytes32 key;
        bytes val;
    }

    struct AttestationCompleteData {
        address creator;
        address about;
        bytes32 key;
        bytes val;
    }

    function allowAutoAttestations(
        bytes32 _key,
        bytes memory _val,
        uint256 _amount
    ) external {
        autoAttestations[msg.sender][_key][_val] = _amount;
        emit AutoAttestationAllowed(msg.sender, _key, _val, _amount);
    }

    function autoAttest(
        AutoAttestationData[] memory _attestations,
        uint256 _amount
    ) public {
        uint256 length = _attestations.length;
        for (uint256 i = 0; i < length; ) {
            AutoAttestationData memory attestation = _attestations[i];
            require(
                autoAttestations[attestation.creator][attestation.key][
                    attestation.val
                ] > 0,
                "Attestation is not allowed"
            );
            uint256 seeks = autoAttestations[attestation.creator][
                attestation.key
            ][attestation.val];
            require(_amount >= seeks, "Insufficient Funds");
            token.transfer(attestation.creator, seeks);
            _amount -= seeks;
            attestations[attestation.creator][attestation.about][
                attestation.key
            ] = attestation.val;
            emit AutoAttestationCreated(
                attestation.creator,
                attestation.about,
                attestation.key,
                attestation.val
            );

            unchecked {
                ++i;
            }
        }
    }

    function xReceive(
        bytes32 _transferId,
        uint256 _amount,
        address _asset,
        address _originSender,
        uint32 _origin,
        bytes memory _callData
    ) external returns (bytes memory) {
        // Check for the right token
        require(_asset == address(token), "Wrong asset received");
        // Enforce a cost to update the greeting
        // require(_amount > 0, "Must pay at least 1 wei");

        // Unpack the _callData
        (
            AutoAttestationData[] memory attests,
            AttestationCompleteData[] memory attestsCreated,
            bool callAutoAttest
        ) = abi.decode(
                _callData,
                (AutoAttestationData[], AttestationCompleteData[], bool)
            );
        if (callAutoAttest) {
            autoAttest(attests, _amount);
        } else {
            attest(attestsCreated);
        }
    }

    function attest(AttestationCompleteData[] memory _attestations) internal {
        uint256 length = _attestations.length;
        for (uint256 i = 0; i < length; ) {
            AttestationCompleteData memory attestation = _attestations[i];
            attestations[attestation.creator][attestation.about][
                attestation.key
            ] = attestation.val;

            emit AttestationCreatedData(
                attestation.creator,
                attestation.about,
                attestation.key,
                attestation.val
            );

            unchecked {
                ++i;
            }
        }
    }
}
