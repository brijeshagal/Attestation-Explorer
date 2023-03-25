// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import {IConnext} from "@connext/interfaces/core/IConnext.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Goerli: 0x2e31055BA8832Bd172185365E514B53713D37801

/**
 * @title SourceGreeter
 * @notice Example source contract that updates a greeting on DestinationGreeter.
 */
contract SourceAttestationStation {
    // The Connext contract on this domain
    IConnext public immutable connext;

    // The token to be paid on this domain
    IERC20 public immutable token;

    // Slippage (in BPS) for the transfer set to 100% for this example
    uint256 public immutable slippage = 10000;

    constructor(address _connext, address _token) {
        connext = IConnext(_connext);
        token = IERC20(_token);
    }

    struct AutoAttestationData {
        address creator;
        address about;
        bytes32 key;
        bytes val;
    }

    struct AttestationData {        
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



    function xAttest(
        address target,
        uint32 destinationDomain,
        AttestationData[] memory attests,
        uint256 amount,
        uint256 relayerFee
    ) external payable {
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "User must approve amount"
        );

        // User sends funds to this contract
        token.transferFrom(msg.sender, address(this), amount);

        // This contract approves transfer to Connext
        token.approve(address(connext), amount);

        AttestationCompleteData[]
            memory _attestations = new AttestationCompleteData[](attests.length);
        for (uint256 i = 0; i < attests.length; ) {            
            _attestations[i] = AttestationCompleteData(
                msg.sender,
                attests[i].about,
                attests[i].key,
                attests[i].val
            );
            unchecked {
                ++i;
            }
        }
        AutoAttestationData[] memory empty;
        // Encode calldata for the target contract call
        bytes memory callData = abi.encode(empty, _attestations, false);

        connext.xcall{value: relayerFee}(
            destinationDomain, // _destination: Domain ID of the destination chain
            target, // _to: address of the target contract
            address(token), // _asset: address of the token contract
            msg.sender, // _delegate: address that can revert or forceLocal on destination
            amount, // _amount: amount of tokens to transfer
            slippage, // _slippage: max slippage the user will accept in BPS (e.g. 300 = 3%)
            callData // _callData: the encoded calldata to send
        );
    }

    function xAutoAttest(
        address target,
        uint32 destinationDomain,
        AutoAttestationData[] memory attests,
        uint256 amount,
        uint256 relayerFee
    ) external payable {
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "User must approve amount"
        );

        // User sends funds to this contract
        token.transferFrom(msg.sender, address(this), amount);

        // This contract approves transfer to Connext
        token.approve(address(connext), amount);
        AutoAttestationData[]
            memory _autoAttestations = new AutoAttestationData[](attests.length);
        for (uint256 i = 0; i < attests.length; ) {            
            _autoAttestations[i] = AutoAttestationData(
                attests[i].creator,
                msg.sender,
                attests[i].key,
                attests[i].val
            );
            unchecked {
                ++i;
            }
        }
        AttestationCompleteData memory empty;

        // Encode calldata for the target contract call

        bytes memory callData = abi.encode(_autoAttestations, empty, true);

        connext.xcall{value: relayerFee}(
            destinationDomain, // _destination: Domain ID of the destination chain
            target, // _to: address of the target contract
            address(token), // _asset: address of the token contract
            msg.sender, // _delegate: address that can revert or forceLocal on destination
            amount, // _amount: amount of tokens to transfer
            slippage, // _slippage: max slippage the user will accept in BPS (e.g. 300 = 3%)
            callData // _callData: the encoded calldata to send
        );
    }
}
