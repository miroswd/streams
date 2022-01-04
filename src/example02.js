// criando socket
const net = require("net");

net.createServer((socket) => socket.pipe(process.stdout)).listen(3314); // duplex stream (writeble, readble)

// $ node -e "process.stdin.pipe(require('net').connect(3314))"
