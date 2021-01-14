var socket;
var uColor;
var data2;
var clientNodes;
var font;
var clients;
var cnodeArr;
var fontSize = 15;
var clientIndex;
var messageArr;
var firstFlag = true;

function preload() {
    font = loadFont('assets/dos.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    textFont(font);
    textSize(fontSize);
    frameRate(30);
    socket = io(); //  or http://127.0.0.1:3000
    socket.on('clientNodes', (data) => {
        cnodeArr = data.arr;
        if (firstFlag) {
            clients = [];
            messageArr = data.messages;
            cnodeArr.forEach(c => {
                let cl = new ClientNode(c.x, c.y, c.z, c.id, c.index);
                clients.push(cl);
            });
            firstFlag = false;
        } else {
            // if a new user has joined
            if (clients.length < cnodeArr.length) {
                let cp = cnodeArr[cnodeArr.length - 1]
                let cl = new ClientNode(cp.x, cp.y, cp.z, cp.id, cp.index);
                clients.push(cl);

            }
            // if a user has exited
            else if (clients.length > cnodeArr.length) {
                var indexTracker;
                clients.splice(data.lastDeletedIndex, 1);
                if (data.lastDeletedIndex < clientIndex) clientIndex--;
                clients.forEach(c => {
                    if (c.index > data.lastDeletedIndex) c.index--;
                    try {
                        for (let i = 0; i < c.receivedMessageData.length; i++) {
                            indexTracker = i;
                            if (data.lastDeletedIndex < c.receivedMessageData[i].index) {
                                c.receivedMessageData[i].index--;
                            } else if (data.lastDeletedIndex == c.receivedMessagesData[i].index) {
                                c.spliceArrays(i);
                            }

                        }
                    } catch (err) {console.log("ERR TRIGGERED: " + clientIndex + " " + indexTracker);}
                        
                });
                
            }
        }
    });
    // this user = clients[clientIndex];
    socket.on('newClientNode', (data) => {
        clientIndex = data.index;

    });

    socket.on('newMessage', (data) => {
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].index != data.index) {
                clients[i].displayReceivedMessage = true;
                clients[i].receivedMessageData.push({
                    msg: data.msg,
                    index: data.index // index corresponding to cnodeArr
                });
                clients[i].receivedMessagesCopy.push('');
                clients[i].distancesFromReceivedNode.push(dist(clients[i].xpos, clients[i].ypos, clients[i].zpos,
                    data.x, data.y, data.z));
                clients[i].receivedMessagesCopyIndices.push(data.msg.length - 1);
                clients[i].charDeletionNums.push(0);
                clients[i].charPushedNums.push(0);
                clients[i].interruptFlags.push(false);
            }
        }
    });

    socket.on('messageArray', (data) => {
        messageArr = data.arr;
        //console.log(messageArr);
    });
}

function draw() {
    //console.log(clients[clientIndex].message);
    orbitControl();
    try {
        background(0);
        push();
        rotateX(frameCount * 0.01);
        clients.forEach(cnode => {
            if (typeof cnode !== "undefined") {
                cnode.display();
                if (cnode.displayReceivedMessage) {
                    // for each received message data
                    try {

                        for (let i = 0; i < cnode.receivedMessageData.length; i++) {

                            push();

                            translate(
                                clients[cnode.receivedMessageData[i].index].xpos,
                                clients[cnode.receivedMessageData[i].index].ypos,
                                clients[cnode.receivedMessageData[i].index].zpos
                            );
                            let vStart = createVector(clients[cnode.receivedMessageData[i].index].xpos,
                                clients[cnode.receivedMessageData[i].index].ypos,
                                clients[cnode.receivedMessageData[i].index].zpos);
                            let vDest = createVector(cnode.xpos, cnode.ypos, cnode.zpos);
                            let vDir = p5.Vector.sub(vDest, vStart).normalize();
                            let vInit = createVector(1, 0, 0);
                            let vBisect = p5.Vector.add(vDir, vInit).normalize();
                            rotate(PI, vBisect);
                            push();
                            rotate(frameCount * 0.1, [1, 0, 0]);
                            if (cnode.index == clientIndex) fill(255, 0, 0);
                            else fill(255);
                            text(cnode.receivedMessagesCopy[i], 0, 0);
                            pop();
                            pop();
                        }
                        cnode.modifyCopiedMessage();
                    } catch (err) {

                    }
                }
            }
        });
    } catch (err) {

    }
    pop();

    // message field
    push();
    var w = 600;
    var h = 200;
    /*
    noFill();
    stroke(255);
    rect(-w * 0.5, 0, w, h);
    */
    fill(255);
    var gap = 20;
    try {
        if (clients.length == 1) text("1 USER ONLINE", -380, 200 - gap);
        else text(clients.length + " USERS ONLINE", -380, 200 - gap);
        for (let i = 0; i < messageArr.length; i++) {
            text(messageArr[i].id + ":  " + messageArr[i].msg, -380, 200 + gap * i);
        }
        text("YOU (" + clients[clientIndex].id + "):  " +
            clients[clientIndex].message, -380, 200 + gap * 6);
    } catch (err) {}
    pop();
}

function keyPressed() {
    switch (keyCode) {
        case ENTER:
            var msgData = {
                x: clients[clientIndex].xpos,
                y: clients[clientIndex].ypos,
                z: clients[clientIndex].zpos,
                msg: clients[clientIndex].message,
                index: clients[clientIndex].index,
                id: clients[clientIndex].id,
                sendTo: [0, 1] // indices of clients to which the message is sent
            };
            clients[clientIndex].sendMessage = true;
            socket.emit('newMessage', msgData);
            clients[clientIndex].message = '';
            break;
        case BACKSPACE:
            clients[clientIndex].message = clients[clientIndex].message.slice(0, clients[clientIndex].message.length - 1);
            break;
        case SHIFT:
            break;
        default:
            clients[clientIndex].message += key;
    }
    //console.log(clients[clientIndex].message);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}