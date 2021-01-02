// import the express framework
var express = require('express');
var app = express();
// listen on port 3000
var server = app.listen(3000);
var fs = require('fs');
console.log("SERVER RUNNING");

// allow static files under the public directory to be hosted
app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);

// deal with certain events
// whenever there's a new connection
io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log(socket.id); // every single new connection has a new id
  fs.appendFile('data.txt', socket.client.id.toString() + '\n', (err, data) => {
    if (err) return console.log("ERROR");
  });

  // til this point, the messages are coming into the server, but not back out.

  // mouse message specified by the client
  socket.on('mouse', (data) => {
      // when received the mouse message from a client,
      // send the data back to ALL clients except the one the sent the message.

      socket.broadcast.emit('mouse', data);
      //io.sockets.emit('mouse', data); // pass the data back to ALL clients including the one that sent the message
      console.log(data);
  });


}

// receiving stuff from the client
