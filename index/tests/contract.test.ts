import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes } from "@graphprotocol/graph-ts"
import { AttestationCreated } from "../generated/schema"
import { AttestationCreated as AttestationCreatedEvent } from "../generated/Contract/Contract"
import { handleAttestationCreated } from "../src/contract"
import { createAttestationCreatedEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let about = Address.fromString("0x0000000000000000000000000000000000000001")
    let key = Bytes.fromI32(1234567890)
    let val = Bytes.fromI32(1234567890)
    let newAttestationCreatedEvent = createAttestationCreatedEvent(
      creator,
      about,
      key,
      val
    )
    handleAttestationCreated(newAttestationCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AttestationCreated created and stored", () => {
    assert.entityCount("AttestationCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AttestationCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AttestationCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "about",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AttestationCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "key",
      "1234567890"
    )
    assert.fieldEquals(
      "AttestationCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "val",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
