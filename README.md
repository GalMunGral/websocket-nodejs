Implemented based on [this guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers).

Echoes every message and sends `Yo` every second. Try this in browser:
```javascript
var s = new WebSocket('ws://localhost:8080');
s.send('Any Message');
```
 
