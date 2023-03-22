import { Polybase } from "@polybase/client";

const db = new Polybase({
  defaultNamespace:
    "pk/0xd2224e3b6a746740705e546bf56b185ab5476880f79799baf0aaf743b32bc3235b768b1765df873484674cf1049394bf839bef7c8f0d0faa4d7ef1c86e24dbb9/AttestationExplorer",
});

const key = db.collection("key");
const about = db.collection("about");
const creator = db.collection("creator");

async function createRecord () {
  // .create(args) args array is defined by the constructor fn
  const recordData = await key.create([
    "trialkey", 
    ["address1", "address2"],
    ["addresscreator", "addresscreator2"]
  ]);

async function updateRecord () {
  // .create(functionName, args) args array is defined by the updateName fn in collection schema
  const recordData = await key
    .record("new-york")
    .call("updateMayor", [db.collection("Person").record("johnbmahone")]);
}
}

