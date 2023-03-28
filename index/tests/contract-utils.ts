import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { AttestationCreated } from "../generated/Contract/Contract"

export function createAttestationCreatedEvent(
  creator: Address,
  about: Address,
  key: Bytes,
  val: Bytes
): AttestationCreated {
  let attestationCreatedEvent = changetype<AttestationCreated>(newMockEvent())

  attestationCreatedEvent.parameters = new Array()

  attestationCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  attestationCreatedEvent.parameters.push(
    new ethereum.EventParam("about", ethereum.Value.fromAddress(about))
  )
  attestationCreatedEvent.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromFixedBytes(key))
  )
  attestationCreatedEvent.parameters.push(
    new ethereum.EventParam("val", ethereum.Value.fromBytes(val))
  )

  return attestationCreatedEvent
}
