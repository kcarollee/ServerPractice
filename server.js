// import the express framework
var express = require('express');
var app = express();
// listen on port 3000
var port = process.env.PORT || 3000 || process.env.YOUR_PORT;
var host = process.env.YOUR_HOST || '0.0.0.0';
var server = app.listen(port, host, () => {
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

const MAX_CLIENT_NUM = 50;
const MAX_MESSAGE_NUM = 5;
const MAX_DISCONNECTED_NODES_NUM = 4;
var clientNodes = [];
var disconnectedNodes = [];
var messageArr = [];

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function newConnection(socket) {
    console.log(socket.id); // every single new connection has a new id
    socket.on('newMessage', (data) => {
        //console.log(data.msg);
        io.sockets.emit('newMessage', data);
        var msgData = {
            msg: data.msg,
            id: data.id,
            index: data.index
        }
        if (messageArr.length < MAX_MESSAGE_NUM) {

            messageArr.push(msgData);
        } else {
            messageArr.shift();
            messageArr.push(msgData);
        }
        var msgArr = {
            arr: messageArr
        };
        io.sockets.emit('messageArray', msgArr);
    });
    var r = 450;
    var newNodeData = {
        x: parseInt(Math.random() * r - r * 0.5),
        y: parseInt(Math.random() * r - r * 0.5),
        z: parseInt(Math.random() * r - r * 0.5),
        color: [getRandomArbitrary(150, 255), getRandomArbitrary(150, 255), getRandomArbitrary(150, 255)],
        id: socket.id,
        index: clientNodes.length
    }

    var nodeArr = {
        arr: clientNodes,
        prevArr: disconnectedNodes,
        updateIndex: false,
        lastDeletedIndex: 0,
        messages: messageArr
    }
    if (clientNodes.length < MAX_CLIENT_NUM) {
        clientNodes.push(newNodeData);
        newNodeData.index = clientNodes.indexOf(newNodeData);
    } else {
        console.log(clientNodes.length);
        clientNodes.shift();
        clientNodes.push(newNodeData);
        clientNodes.forEach(n => {
            n.index = clientNodes.indexOf(n);
        });
        io.sockets.emit('clientNodes', nodeArr);
        console.log("CLIENT NODES INDEX UPDATED");
        console.log(nodeArr);
    }

    socket.emit('newClientNode', newNodeData);

    io.sockets.emit('clientNodes', nodeArr);


    socket.on('updateMessages', (data) => {

    });

    socket.on('newName', (data) => {
        clientNodes[data.index].id = data.name;
        io.sockets.emit('newName', data);
    });
    socket.on('disconnect', () => {
        console.log("DISCONNECTED");
        disconnectedNodes.push(newNodeData);
        if (disconnectedNodes.length > MAX_DISCONNECTED_NODES_NUM){
            disconnectedNodes.shift();
        }
        var prevData = {arr: disconnectedNodes};
        io.sockets.emit('previousUsers', prevData);
        clientNodes.splice(newNodeData.index, 1);
        nodeArr.lastDeletedIndex = newNodeData.index;
        clientNodes.forEach(n => {
            n.index = clientNodes.indexOf(n);
        });
        nodeArr.updateIndex = true;
        io.sockets.emit('clientNodes', nodeArr);
        nodeArr.updateIndex = false;
    });


}

// receiving stuff from the client