import { Polybase } from "@polybase/client";
import Wallet from "ethereumjs-wallet";
import { ethPersonalSign } from "@polybase/eth";
import { Polybase } from "@polybase/client";
// PK, need to establish a PK so we can control updates

const schema = `
@public
collection about{
  id: string;
  creator: string[];
  key: string[];
  publicKey?: PublicKey
  constructor(){
    this.key = [];
    this.creator = [];
    if (ctx.publicKey)
    this.publicKey = ctx.publicKey;
  }
}
@public
collection key {
  id: string; 
  about: string[];
  creator: string[];  
  publicKey?: PublicKey
  constructor(){
    this.about = [];
    this.creator = [];
    if (ctx.publicKey)
    this.publicKey = ctx.publicKey;
  }
}
@public
collection creator {
  id: string;
  about: string[];
  key: string[];
  publicKey?: PublicKey
  constructor(){
    this.about = [];
    this.key = [];
    if (ctx.publicKey)
      this.publicKey = ctx.publicKey;
  }
}
`;

const PRIVATE_KEY = process.env.POLYBASE_PRIVATE_KEY ?? "";
const db = new Polybase({
  defaultNamespace: "trial",
});

async function load() {
  if (!PRIVATE_KEY) {
    throw new Error("No private key provided");
  }

  await db.applySchema(schema, "trial");

  return "Schema loaded";
}

export default load;
