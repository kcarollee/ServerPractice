var socket;
var uColor;
var data2;
var clientNodes;
var font;


class ClientNode {
    constructor(xpos, ypos, zpos, id, index) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.zpos = zpos;
        this.id = id;
        this.index = index;
        this.message = '';

        this.sendMessage = false;


        this.receivedMessage = '';
        this.messageCopy = '';
        this.displayReceivedMessage = false;
        this.messageCopyIndex = this.message.length - 1;

        this.receivedMessageData = []; // obj ( msg & clientNode index)
        this.receivedMessagesCopy = []; // msg only
        this.receivedMessagesCopyIndices = []; // keeping track of indices
        this.distancesFromReceivedNode = []; // keeping track of distances
        this.charDeletionNums = [];
        this.charPushedNums = [];
        this.interruptFlags = [];
    }

    modifyCopiedMessage() {
        var indexTracker = 0;
        var fontMult = 1.0;
        try {
            for (let i = 0; i < this.receivedMessagesCopy.length; i++) {
                indexTracker = i;
                // if the received message is longer than the distance
                if (textWidth(this.receivedMessageData[i].msg) * fontMult > this.distancesFromReceivedNode[i]) {
                    // *str-*
                    if (textWidth(this.receivedMessagesCopy[i]) * fontMult < this.distancesFromReceivedNode[i] && !this.interruptFlags[i]) {
                        this.receivedMessagesCopy[i] =
                            this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
                        this.receivedMessagesCopyIndices[i]--;
                        this.charPushedNums[i]++;
                    }
                    // *stri*
                    else {
                        this.interruptFlags[i] = true;
                        // if there are characters of the original message to copy left
                        if (this.receivedMessagesCopyIndices[i] >= 0) {

                            this.receivedMessagesCopy[i] =
                                this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
                            this.receivedMessagesCopy[i] =
                                this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
                            this.receivedMessagesCopyIndices[i]--;
                        }
                        // if the original text is finished displaying and blanks need to be filled
                        else if (this.charPushedNums[i] >= 0) {
                            this.receivedMessagesCopy[i] =
                                this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
                            this.receivedMessagesCopy[i] = "  " + this.receivedMessagesCopy[i];

                            this.charPushedNums[i]--;
                        }
                        // else delete 
                        else {
                            this.receivedMessagesCopy.splice(i, 1);
                            this.receivedMessagesCopyIndices.splice(i, 1);
                            this.receivedMessageData.splice(i, 1);
                            this.charDeletionNums.splice(i, 1);
                            this.charPushedNums.splice(i, 1);
                            this.distancesFromReceivedNode.splice(i, 1);
                            this.interruptFlags.splice(i, 1);
                        }
                    }
                }
                // if the received message is shorter than the distance
                else {
                    // *string---*
                    if (textWidth(this.receivedMessagesCopy[i]) * fontMult < this.distancesFromReceivedNode[i]) {
                        // if the original message isn't finished copying
                        if (this.receivedMessagesCopyIndices[i] >= 0) {
                            this.receivedMessagesCopy[i] =
                                this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
                            this.receivedMessagesCopyIndices[i]--;
                            this.charDeletionNums[i]++;
                        }
                        // is finished copying and needs blanks
                        else {
                            this.receivedMessagesCopy[i] = " " + this.receivedMessagesCopy[i];
                        }
                    }
                    // *---string*
                    else {
                        // start slicing copied message from the right and push it with blanks
                        if (this.charDeletionNums[i] >= 0) {
                            this.receivedMessagesCopy[i] =
                                this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
                            this.receivedMessagesCopy[i] = " " + this.receivedMessagesCopy[i];
                            this.charDeletionNums[i]--;
                        }
                        // else delete
                        else {
                            this.receivedMessagesCopy.splice(i, 1);
                            this.receivedMessagesCopyIndices.splice(i, 1);
                            this.receivedMessageData.splice(i, 1);
                            this.charDeletionNums.splice(i, 1);
                            this.charPushedNums.splice(i, 1);
                            this.distancesFromReceivedNode.splice(i, 1);
                            this.interruptFlags.splice(i, 1);
                        }
                    }
                }
            }
        } catch (err) {
            // gets triggered when users exit before all the message strings are processed
            this.receivedMessagesCopy.splice(indexTracker, 1);
            this.receivedMessagesCopyIndices.splice(indexTracker, 1);
            this.receivedMessageData.splice(indexTracker, 1);
            this.charDeletionNums.splice(indexTracker, 1);
            this.charPushedNums.splice(indexTracker, 1);
            this.distancesFromReceivedNode.splice(indexTracker, 1);
            this.interruptFlags.splice(indexTracker, 1);
        }
    }

    display() {
        noStroke();
        fill(255);
        push();
        translate(this.xpos, this.ypos, this.zpos)
        sphere(12, 12, 10);

        if (typeof this.id !== "undefined" &&
            typeof clientIndex !== "undefined") {
            if (clientIndex == this.index) {
                rotateX(-frameCount * 0.01);
                fill(200, 50, 180);
                text("YOUR ID: " + this.id.toString(), -130, -20);
            }
        }
        pop();
    }
}


var clients;
var cnodeArr;
var fontSize = 15;
var clientIndex;
var messageArr;
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
        clients = [];
        messageArr = data.messages;
        cnodeArr.forEach(c => {
            let cl = new ClientNode(c.x, c.y, c.z, c.id, c.index);
            clients.push(cl);
        });

        if (data.updateIndex) {

            if (data.lastDeletedIndex < clientIndex) clientIndex--;
            //else if (data.lastDeletedIndex == clientIndex) 
            console.log("THIS CLIENT'S NEW INDEX: " + clientIndex);

            clients.forEach(c => {
                for (let i = 0; i < c.receivedMessageData.length; i++) {

                    if (data.lastDeletedIndex < c.receivedMessageData[i].index) c.receivedMessageData[i].index--;
                    // might have to splice rest of the arrays
                    else if (data.lastDeletedIndex == c.receivedMessagesData[i].index) c.receivedMessageData.splice(i, 1);

                }

            });

            data.updateIndex = false;
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
                clients[i].distancesFromReceivedNode.push(dist(clients[i].xpos, clients[i].ypos, clients[i].ypos,
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
        console.log(messageArr);
    });
}

function draw() {
    background(0);
    push();
    rotateX(frameCount * 0.01);
    try {
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
    try{
    if (clients.length == 1) text("1 USER ONLINE", -380, 200 - gap);
    else text(clients.length + " USERS ONLINE", -380, 200 - gap);
    for (let i = 0; i < messageArr.length; i++){
        text(messageArr[i].id + ":  " + messageArr[i].msg, -380, 200 + gap * i);
    }
    text("YOU (" + clients[clientIndex].id + "):  "  + 
        clients[clientIndex].message, -380, 200 + gap * 6);
    }
    catch(err){}
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

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}