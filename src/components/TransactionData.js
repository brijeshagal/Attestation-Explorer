const axios = require("axios");
const abiDecoder = require("abi-decoder");

const data = "";
const contract_address = "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77";

const getABI = async () => {
  const res = await axios.get(url);
  return JSON.parse(res.data.result);
};

const main = async () => {
  const ABI = await getABI();
  abiDecoder.addABI(ABI);

  const decodedData = abiDecoder.decodeMethod(data);
  console.log("decodedData: ", JSON.stringify(decodedData));
};

main();