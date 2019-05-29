const net = require('net');
const crypto = require('crypto');
const decode = require('./decoder');
const encode = require('./encoder');
const server = net.createServer({ allowHalfOpen: true });
const openSockets = [];

function handShake(socket, key) {
  let concat = key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  let hash = crypto.createHash('sha1').update(concat);
  let accept = hash.digest('base64');
  let header = (
    'HTTP/1.1 101 Switching Protocols\r\n'
    + 'Upgrade: websocket\r\n'
    + 'Connection: Upgrade\r\n'
    + `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  );
  socket.write(header, 'utf8');
  openSockets.push(socket);
}

server.on('connection', socket => {
  socket.on('data', data => {
    if (!openSockets.includes(socket)) {
      let key = data.toString().match(/Sec-WebSocket-Key: (.+)/)[1];
      return handShake(socket, key)
    }
    decoded = decode(data);
    socket.write(encode(decoded.toString()));   
  });
  socket.on('close', () => {
    console.log('closed');
  })
  socket.on('error', err => {
    console.log(err)
  })

  // Test pushing data
  setInterval(() => {
    socket.write(encode('Yo'));
  }, 1000);
});

server.listen(8080, () => {
  console.log('listening on 8080')
});