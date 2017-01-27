var Ledger3 = require('./third-party/ledger3');
var LedgerEth = require('./third-party/ledger-eth');
var ethUtil = require('ethereumjs-util');
var Tx = require('ethereumjs-tx');

class LedgerEthereum {
    constructor() {
        var ledger = new Ledger3("w0w");
        this.app = new LedgerEth(ledger);
    }

    callback(resolve, reject) {
        return function (ok, error) {
            if (ok !== undefined) {
                resolve(ok)
            } else {
                reject(error)
            }
        }
    }

    getAddress(path) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var display = false;
            var chainCode = true;
            self.app.getAddress(path, self.callback(resolve, reject), display, chainCode);
        })
    }

    signTransaction(path, params) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var eTx = new Tx(params);
            var EIP155Supported = false;
            eTx.raw[6] = Buffer.from([1]); //ETH chain id
            eTx.raw[7] = eTx.raw[8] = 0;
            var toHash = !EIP155Supported ? eTx.raw.slice(0, 6) : eTx.raw;
            var txToSign = ethUtil.rlp.encode(toHash);
            var onSigned = function localCallback(result, error) {
                if (error !== undefined)
                    reject(error);
                params.v = "0x" + result['v'];
                params.r = "0x" + result['r'];
                params.s = "0x" + result['s'];
                eTx = new Tx(params);
                resolve('0x' + eTx.serialize().toString('hex'));
            };
            self.app.signTransaction(path, txToSign.toString('hex'), onSigned);
        })
    }
}

module.exports = LedgerEthereum;