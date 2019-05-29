module.exports = function encode(str) {
  let length = Buffer.from(str).length;
  let encoded = Buffer.concat([
    Buffer.from([0x81]),
    length < 0x7e
      ? Buffer.from([length])
      : length <= 0xffff
        ? (() => {
          let buf = Buffer.alloc(3);
          buf.writeUInt8(0x7e, 0);
          buf.writeUIntBE(length, 1, 2);
          return buf;
        })()
        : (() => {
          let buf = Buffer.alloc(9);
          buf.writeUInt8(0x7f, 0);
          buf.writeUIntBE(length, 1, 8);
          return buf;
        })()
    ,Buffer.from(str)
  ]);
  return encoded;
}