import { AttestationCreated as AttestationCreatedEvent } from "../generated/Contract/Contract"
import { AttestationCreated } from "../generated/schema"

export function handleAttestationCreated(event: AttestationCreatedEvent): void {
  let entity = new AttestationCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.about = event.params.about
  entity.key = event.params.key
  entity.val = event.params.val

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
