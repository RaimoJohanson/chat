var express = require('express');
var path = require('path');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
const { Console } = require('console');

app.use(cors())
app.use(express.static(path.join(__dirname, '../fe-mvp/dist/fe-mvp')))

const connections = new Set();

io.on('connection', (socket) => {
  connections.add(socket.id);
  console.log('Connected: ', socket.id);

  socket.on('disconnect', () => {
    connections.delete(socket.id);
    io.emit('disconnect', socket.id);
  });

  socket.on('message', (message) => {
    console.log('Message: ', message);
    io.emit('message', { ...message, id: socket.id});
  });

  socket.on('expression', (message) => {
    io.emit('expression', { ...message, id: socket.id});
  });

});

http.listen(3333, () => {
  console.log('listening on *:3333');
});