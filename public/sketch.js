var socket;
var uColor;
var data2;
var clientNodes;
var font;
var pgFont;
var clients;
var cnodeArr;
var fontSize = 15;
var clientIndex;
var messageArr;
var firstFlag = true;
var nameSet = false;
var clientName = '';
var disconnectedNodes;
var pg;
var shd;
var gl;
var errFlag = false;

class Walker {

}
function preload() {
    font = loadFont('assets/dos.ttf');
    pg = createGraphics(windowWidth, windowHeight, WEBGL);
    pgFont = pg.loadFont('assets/dos.ttf');
    shd = loadShader('assets/Shader.vert', 'assets/Shader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    
    pg.textFont(pgFont);
    pg.textSize(fontSize);
    pg.frameRate(30);

    textFont(font);
    textSize(fontSize);
    frameRate(30);
    socket = io(); //  or http://127.0.0.1:3000
    socket.on('clientNodes', (data) => {
        cnodeArr = data.arr;
        disconnectedNodes = data.prevArr;
        if (firstFlag) {
            clients = [];
            messageArr = data.messages;
            cnodeArr.forEach(c => {
                let cl = new ClientNode(c.x, c.y, c.z, c.id, c.index, c.color);
                clients.push(cl);
            });
            firstFlag = false;
        } else {
            // if a new user has joined
            if (clients.length < cnodeArr.length) {
                let cp = cnodeArr[cnodeArr.length - 1]
                let cl = new ClientNode(cp.x, cp.y, cp.z, cp.id, cp.index, cp.color);
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
                    } catch (err) {
                        console.log("ERR TRIGGERED: " + clientIndex + " " + indexTracker);
                        errFlag = true;
                    }
                        
                });
                
            }


        }
    });
    // this user = clients[clientIndex];
    socket.on('newClientNode', (data) => {
        clientIndex = data.index;

    });

    socket.on('newName', (data) =>{
        clients[data.index].id = data.name;
    });

    socket.on('newMessage', (data) => {
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].index != data.index) {
                clients[i].displayReceivedMessage = true;
                clients[i].receivedMessageData.push({
                    msg: data.msg,
                    index: data.index, // index corresponding to cnodeArr
                    color: data.color
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

    socket.on('previousUsers', (data) =>{
        disconnectedNodes = data.arr;
    });

    gl = this._renderer.GL;
    gl.disable(gl.DEPTH_TEST);
    pggl = pg._renderer.GL;
    console.log(pggl);
    //pggl.disable(pggl.DEPTH_TEST);
}

function draw() {
    //console.log(clients[clientIndex].message);

    pg.background(25, 100);
    pg.ambientLight(60, 60, 60);
    pg.pointLight(255, 255, 255, 0, 0, 200);
    pg.rotateX(PI);
    if (!nameSet){
        pg.push();
        pg.translate(0, -300, -100);
        pg.fill(255);
        pg.textSize(50);
        pg.textAlign(CENTER);
        pg.fill(0, 255, 0);
        pg.text("ENTER YOUR NAME: " + clientName, 0, 0);
        pg.textSize(fontSize);
        pg.textAlign(LEFT);
        pg.pop();
    }
    try {
        pg.textSize(fontSize);
        pg.push();
        try{
        disconnectedNodes.forEach(dn => {
            pg.push();
            pg.rotateX(frameCount * 0.01);
            pg.rotateY(frameCount * 0.01);
            pg.noFill();
            pg.stroke(0, 0, 255);
            pg.push();
            pg.translate(dn.x, dn.y, dn.z);
            pg.rotateX(frameCount * 0.01 + dn.index);
            pg.rotateY(frameCount * 0.01 + dn.index);
            pg.box(15);
            pg.pop();

            pg.push();
            pg.fill(0, 255, 255);
            pg.translate(dn.x, dn.y, dn.z);
            pg.rotateY(-frameCount * 0.01);
            pg.rotateX(-frameCount * 0.01);
            pg.textAlign(CENTER);
            pg.text("DISCONNECTED", 0, -fontSize * 1.2);
            pg.textAlign(LEFT);
            pg.pop();
            pg.pop();
        });
        var r1 = int(random(0, disconnectedNodes.length));
        var r2 = int(random(0, disconnectedNodes.length));
        var d1 = disconnectedNodes[r1];
        var d2 = disconnectedNodes[r2];

        pg.push();
        pg.rotateX(frameCount * 0.01);
        pg.rotateY(frameCount * 0.01);
        pg.strokeWeight(3);
        pg.stroke(0, 0, 255);
        pg.line(
            d1.x, d1.y, d1.z, d2.x, d2.y, d2.z
        );
        pg.pop();
        } catch(err){}
        clients.forEach(cnode => {
            //text(cnode.id, 0, 10 * cnode.index);
            if (typeof cnode !== "undefined") {
                var ms = 0.005; // mouse sensitivity
                pg.push();
                pg.rotateX(frameCount * 0.01 + mouseY * ms);
                pg.rotateY(frameCount * 0.01 + mouseX * ms);
                pg.rotateZ(frameCount * 0.01);
                pg.translate(cnode.xpos, cnode.ypos, cnode.zpos);
                pg.rotateZ(-frameCount * 0.01);
                pg.rotateY(-frameCount * 0.01 - mouseX * ms);
                pg.rotateX(-frameCount * 0.01 - mouseY * ms);
                if (cnode.index == clientIndex) pg.fill(0, 255, 0);
                else pg.fill(255);
                pg.textAlign(CENTER);
                pg.text(cnode.id, 0, -fontSize * 1.25);
                pg.textAlign(LEFT);
                pg.pop();

                pg.push();
                pg.rotateX(frameCount * 0.01 + mouseY * ms);
                pg.rotateY(frameCount * 0.01 + mouseX * ms);
                pg.rotateZ(frameCount * 0.01);
                cnode.display(pg);
                if (cnode.displayReceivedMessage) {
                    // for each received message data
                    try {

                        for (let i = 0; i < cnode.receivedMessageData.length; i++) {

                            pg.push();

                            pg.translate(
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
                            pg.rotate(PI, vBisect);
                            pg.push();
                            pg.rotate(frameCount * 0.1, [1, 0, 0]);
                            if (cnode.index == clientIndex) pg.fill(255, 0, 0);
                            else pg.fill(clients[cnode.receivedMessageData[i].index].color);
                            pg.text(cnode.receivedMessagesCopy[i], 0, 0);

                            pg.pop();
                            pg.pop();
                        }
                        cnode.modifyCopiedMessage();
                    } catch (err) {

                    }
                }
                pg.pop();
            }
        });
        pg.pop();
    } catch (err) {

    }
    


    //image(pg, -windowWidth * 0.5, -windowHeight * 0.5);
    
    push();
    shader(shd);
    shd.setUniform('tex', pg);
    shd.setUniform('resolution', [pg.width, pg.height]);
    shd.setUniform('time', frameCount);
    rectMode(CENTER);

    rect(0, 0, 300 + 300 * sin(frameCount), 600);
    pop();
    
    //pg.resetMatrix();
    pg._renderer._update();
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
        if (errFlag){
            fill(255, 0, 0);
            text("AN ERROR MAY HAVE OCCURRED.", -380, 300 - 2 * gap);
        }
        if (clients.length == 1) text("1 USER ONLINE", -380, 300 - gap);
        else text(clients.length + " USERS ONLINE", -380, 300 - gap);
        for (let i = 0; i < messageArr.length; i++) {
            //fill(clients[messageArr[i].index].color);
            fill(255);
            text(messageArr[i].id + ":  " + messageArr[i].msg, -380, 300 + gap * i);
        }
        fill(255);
        text("YOU (" + clients[clientIndex].id + "):  " +
            clients[clientIndex].message, -380, 300 + gap * 6);
    } catch (err) {console.log("WEIRD")}
    
}

function keyPressed() {
    if (nameSet){
    switch (keyCode) {
        case ENTER:
            var msgData = {
                x: clients[clientIndex].xpos,
                y: clients[clientIndex].ypos,
                z: clients[clientIndex].zpos,
                msg: clients[clientIndex].message,
                index: clients[clientIndex].index,
                id: clients[clientIndex].id,
                color: clients[clientIndex].color,
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
    }
    else {
        switch(keyCode){
            case ENTER:
            if (!includesSpace(clientName)){
                nameSet = true;
                clients[clientIndex].id = clientName;
                var nameData = {
                    name: clientName,
                    index: clientIndex
                };
                socket.emit('newName', nameData);
            }
                break;
            case BACKSPACE:
                clientName = clientName.slice(0, clientName.length - 1);
                break;
            case SHIFT:
                break;
            default:

                if (clientName.length < 10) clientName += key;
        }
    }
    //console.log(clients[clientIndex].message);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    pg.resizeCanvas(windowWidth, windowHeight);
}

function includesSpace(str){
    for (let i = 0; i < str.length; i++){
        if (str[i] == ' ') return true;
    }
    return false;
}