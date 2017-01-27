window.u2f = require('./third-party/u2f-api');
window.Buffer = require('buffer');

var ethUtil = require('ethereumjs-util');
var LedgerEthereum = require('./ledger-ethereum');

var BASE_DERIVATION_PATH = "m/44'/60'/0'";
var CHILD_INDEX = "0";
var PATH = `${BASE_DERIVATION_PATH}/${CHILD_INDEX}`;
var le = new LedgerEthereum();
le.getAddress(PATH).then((addr)=>console.log(addr));
var COIN = 1e18;
var txParams = {
    nonce: "0x07",
    gasPrice: "0x098bca5a00",
    gasLimit: "0x5208",
    to: "0x0047CAa030BEE5Ce7b7805F665d62304fa76E662",
    value: ethUtil.intToHex(0.1 * COIN),
    data: "",
    chainId: 4
};

le.signTransaction(PATH, txParams).then((result)=>console.log(result));