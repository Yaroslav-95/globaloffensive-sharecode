/* eslint no-bitwise: 0 */
const BigNumber = require('big-number');
const packJS = require('./utils/pack');
const StringIO = require('./utils/stringio');

class ByteReader {
  constructor(io) {
    this.io = io;
  }

  get readInt64() {
    const temp = this.io.read(8);
    const unpacked = packJS.unpack('C*', temp);
    let result = BigNumber(0);

    Object.keys(unpacked).forEach((key) => {
      const index = key - 1;
      const byte = unpacked[key];

      const a = BigNumber(256).power(new BigNumber(index));
      const b = BigNumber(byte).multiply(a);

      result = result.plus(b);
    });

    return result.toString();
  }

  get readShort() {
    const temp = this.io.read(2);
    const unpacked = packJS.unpack('S*', temp);

    return unpacked[''].toString();
  }
}

class ShareCode {
  constructor(code) {
    this.code = ShareCode.sanitizeCode(code);
    this.originalCode = code;

    this.DICTIONARY = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789';
    this.DICTIONARY_LENGTH = this.DICTIONARY.length;
  }

  static sanitizeCode(str) {
    return str.replace(/CSGO|-/g, '');
  }

  decode() {
    const reader = new ByteReader(this.io);
    const matchId = reader.readInt64;
    const outcomeId = reader.readInt64;
    const token = reader.readShort;

    return {
      matchId,
      outcomeId,
      token,
    };
  }

  get io() {
    return new StringIO.StringIO(this.decodedCode);
  }

  get decodedCode() {
    const self = this;
    const reversed = this.code.split('').reverse();
    let result = new Array(18).fill(0);

    reversed.forEach((char) => {
      const addval = self.DICTIONARY.indexOf(char);
      const tmp = new Array(18).fill(0);
      let carry = 0;
      let v = 0;

      for (let t = 17; t >= 0; t--) {
        carry = 0;
        for (let s = t; s >= 0; s--) {
          if (t - s === 0) {
            v = tmp[s] + result[t] * 57;
          } else {
            v = 0;
          }
          v += carry;
          carry = v >> 8;
          tmp[s] = v & 0xFF;
        }
      }
      result = tmp;
      carry = 0;

      for (let t = 17; t >= 0; t--) {
        if (t === 17) {
          v = result[t] + addval;
        } else {
          v = result[t];
        }
        v += carry;
        carry = v >> 8;
        result[t] = v & 0xFF;
      }
    });

    result.unshift('C*');

    return packJS.pack.apply(this, result);
  }
}

exports.ShareCode = ShareCode;
