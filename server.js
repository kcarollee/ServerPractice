// import the express framework
var express = require('express');
var app = express();
// listen on port 3000
var port = process.env.PORT || 3000 || process.env.YOUR_PORT;
var host = process.env.YOUR_HOST || '0.0.0.0';
var server = app.listen(port, host, () =>{
  console.log('STARTING SERVER AT ${port}');
});
var fs = require('fs');
console.log("SERVER RUNNING");

// allow static files under the public directory to be hosted
app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);

// deal with certain events
// whenever there's a new connection
io.sockets.on('connection', newConnection);

const MAX_CLIENT_NUM = 15;
var clientNodes = [];
function newConnection(socket){
  console.log(socket.id); // every single new connection has a new id
  /*
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
      //console.log(data);
  });

  socket.on('update', (data2) => {
    //console.log(posData);
    //socket.broadcast.emit('update', posData);
    io.sockets.emit('update', data2);
  });
  */
  var r = 300;
  var newNodeData = {
    x: parseInt(Math.random() * r - r * 0.5),
    y: parseInt(Math.random() * r - r * 0.5),
    z: parseInt(Math.random() * r - r * 0.5),
    id: socket.id,
    index: clientNodes.length
  }

  var nodeArr = {
    arr: clientNodes
  }
  if (clientNodes.length < MAX_CLIENT_NUM) {
    clientNodes.push(newNodeData);
    newNodeData.index = clientNodes.indexOf(newNodeData);
  }
  else {
    console.log(clientNodes.length);
    clientNodes.shift();
    clientNodes.push(newNodeData);
    clientNodes.forEach(n => {
     n.index = clientNodes.indexOf(n);
    });
  }

  socket.emit('newClientNode', newNodeData);
  
  io.sockets.emit('clientNodes', nodeArr);

  socket.on('disconnect', () => {
    console.log("DISCONNECTED");
      clientNodes.splice(newNodeData.index, 1);
      clientNodes.forEach(n => {
        n.index = clientNodes.indexOf(n);
      });
      io.sockets.emit('clientNodes', nodeArr);
  });
}

// receiving stuff from the client
