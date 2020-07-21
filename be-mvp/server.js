var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
const { Console } = require('console');

app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const connections = new Set();

io.on('connection', (socket) => {
  connections.add(socket.id);

  socket.on('disconnect', () => {
    connections.delete(socket.id);
    io.emit('disconnect', socket.id);
  });

  socket.on('message', (message) => {
    io.emit('message', { ...message, id: socket.id});
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});