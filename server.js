const net = require('net');
const fs = require('fs');
const crypto = require('crypto');
const decode = require('./decoder');
const encode = require('./encoder');
const openSockets = new Set();

function handShake(socket, key) {
  let hash = crypto.createHash('sha1')
  hash.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
  let header = (
    'HTTP/1.1 101 Switching Protocols\r\n'
    + 'Upgrade: websocket\r\n'
    + 'Connection: Upgrade\r\n'
    + `Sec-WebSocket-Accept: ${hash.digest('base64')}\r\n\r\n`
  );
  socket.write(header, 'utf8');
  openSockets.add(socket);
}

function serveIndex(socket) {
  socket.write('HTTP/1.1 200 OK\r\n\r\n', 'utf8');
  fs.createReadStream('index.html').pipe(socket);
}

const server = net.createServer({ allowHalfOpen: true });

server.on('connection', socket => {
  socket.on('data', data => {
    if (!openSockets.has(socket)) {
      let match = data.toString().match(/Sec-WebSocket-Key: (.+)/);
      if (!match) {
        // Regular HTTP request
        serveIndex(socket);
        return;
      }
      let key = match[1]; // The key is captured by `(.+)` group
      handShake(socket, key);
      setInterval(() => {
        socket.write(encode('From Server: ' + Date()));
      }, 5000);
    } else {
      decoded = decode(data);
      socket.write(encode('Server Echo: ' + decoded.toString()));   
    }
  });
  
  socket.on('close', () => {
    if (openSockets.has(socket)) openSockets.delete(socket);
  });
  socket.on('error', err => {
    if (openSockets.has(socket)) openSockets.delete(socket);
  });
});

server.listen(8080, () => console.log('listening on 8080'));
