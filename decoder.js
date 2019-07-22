module.exports = function decode(data) {
  let offset;
  let length = data[1] - 0x80;
  switch(length) {
    case 0x7f: {
      offset = 8;
      length = data.readUIntBE(2, 8);
      break;
    }
    case 0x7e: {
      offset = 2;
      length = data.readUIntBE(2, 2);
      break;
    }
    default: offset = 0;
  }
  let mask = data.slice(2 + offset, 6 + offset);
  let encoded = data.slice(6 + offset);
  let decoded = Buffer.from([]);
  for (let i = 0; i < length; i++) {
    decoded = Buffer.concat([
      decoded, 
      Buffer.from([encoded.readUInt8(i) ^ mask.readUInt8(i % 4)])
    ]);
  }
  return decoded;
}