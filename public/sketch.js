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
        this.message = "HI MY ID IS " + this.id.toString();

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
                //console.log(this.receivedMessagesCopy[i] + " " + this.receivedMessageData[i].msg.length);
                //console.log("CALC LENGTH: " + textWidth(this.receivedMessagesCopy[i]));
                /*
                if (this.receivedMessagesCopy[i].length < this.receivedMessageData[i].msg.length) {
                    this.receivedMessagesCopy[i] =
                        this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
                    this.receivedMessagesCopyIndices[i]--;
                    // *stri*

                } else {
                    console.log("ELSE " + this.receivedMessagesCopy[i].length * fontSize +
                        " " + this.distancesFromReceivedNode[i]);

                    // until *-----string*
                    if (this.receivedMessagesCopy[i].length * fontSize * 2.0 < this.distancesFromReceivedNode[i]) {
                        this.receivedMessagesCopy[i] = ' ' + this.receivedMessagesCopy[i];

                    } else {
                        // if
                        if (this.charDeletionNums[i] < this.receivedMessageData[i].msg.length) {
                            this.receivedMessagesCopy[i] =
                                this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
                            this.receivedMessagesCopy[i] = "  " + this.receivedMessagesCopy[i];
                            console.log("LENGTH: " + this.receivedMessagesCopy[i].length);
                            this.charDeletionNums[i]++;
                            console.log("SLICED: " + this.receivedMessagesCopy[i] + " " + this.charDeletionNums[i]);
                        } else {
                            this.receivedMessagesCopy.splice(i, 1);
                            this.receivedMessagesCopyIndices.splice(i, 1);
                            this.receivedMessageData.splice(i, 1);
                            this.charDeletionNums[i] = 0;
                        }
                    }
                    
                    //this.receivedMessagesCopy.splice(i, 1);
                    //this.receivedMessagesCopyIndices.splice(i, 1);
                    //this.receivedMessageData.splice(i, 1);
                    
                }
                */
                
                // if the received message is longer than the distance
                if(textWidth(this.receivedMessageData[i].msg) * fontMult > this.distancesFromReceivedNode[i]){
                    // *str-*
                    //console.log("LONGER: " + textWidth(this.receivedMessageData[i].msg)  + " " + this.distancesFromReceivedNode[i]);
                   
                    if (textWidth(this.receivedMessagesCopy[i]) * fontMult < this.distancesFromReceivedNode[i] && !this.interruptFlags[i]){
                        this.receivedMessagesCopy[i] =
                        this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
                        this.receivedMessagesCopyIndices[i]--;
                        this.charPushedNums[i]++;
                        console.log("TEST FOR INTERRUPT");
                    }
                    // *stri*
                    else {
                        this.interruptFlags[i] = true;
                        // if there are characters of the original message to copy left
                        if (this.receivedMessagesCopyIndices[i] >= 0){
                            //console.log(this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1));
                            this.receivedMessagesCopy[i] =
                                this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
                            this.receivedMessagesCopy[i] =
                                this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
                            this.receivedMessagesCopyIndices[i]--;
                            console.log("STEP 2: " + this.receivedMessagesCopy[i]);
                        }
                        // if the original text is finished displaying and blanks need to be filled
                        else if(this.charPushedNums[i] >= 0) {
                            console.log("STEP 3: " + this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1));
                            this.receivedMessagesCopy[i] =
                                this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
                            this.receivedMessagesCopy[i] = "  " + this.receivedMessagesCopy[i];

                            this.charPushedNums[i]--;
                        }
                        // else delete 
                        else {
                            console.log("DEL");
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
                    //console.log("SHORTER: " + textWidth(this.receivedMessageData[i].msg)  + " " + this.distancesFromReceivedNode[i]);
                    if (textWidth(this.receivedMessagesCopy[i]) * fontMult < this.distancesFromReceivedNode[i]){
                        // if the original message isn't finished copying
                        if (this.receivedMessagesCopyIndices[i] >= 0){
                            this.receivedMessagesCopy[i] =
                                this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
                            this.receivedMessagesCopyIndices[i]--;
                            this.charDeletionNums[i]++;
                        }
                        // is finished copying and needs blanks
                        else {
                            this.receivedMessagesCopy[i] = " " + this.receivedMessagesCopy[i];
                            //console.log(this.receivedMessagesCopy[i]);
                        }
                    }
                    // *---string*
                    else {
                        // start slicing copied message from the right and push it with blanks
                        if (this.charDeletionNums[i] >= 0){
                            this.receivedMessagesCopy[i] =
                                this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
                            this.receivedMessagesCopy[i] = " " + this.receivedMessagesCopy[i];
                            this.charDeletionNums[i]--;
                        }
                        // else delete
                        else {
                            console.log("DEL");
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
            //console.log(err);
            console.log("DEL");
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

var cnode;
var clients;
var cnodeArr;
var fontSize = 15;
var clientIndex;

function preload() {
    font = loadFont('assets/helvetica.ttf');
}

function setup() {
    createCanvas(800, 800, WEBGL);
    textFont(font);
    textSize(fontSize);
    frameRate(30);
    socket = io(); //  or http://127.0.0.1:3000
    /*
    socket.on('mouse', (data) => {
      noFill();
      stroke(255);
      var size = noise(frameCount * 0.1) * 50;
      ellipse(data.x, data.y, size, size);
      noStroke();
    });

    data2 = {
      x: mouseX,
      y: mouseY,
      id: socket.id,
      r: random(0, 255),
      g: random(0, 255),
      b: random(0, 255)
    }
    uColor = color(data2.r, data2.g, data2.b);
    socket.on('update', (data2) => {
      //console.log(data2);
      fill(color(data2.r, data2.g, data2.b));
      text("ID: " + data2.id, data2.x, data2.y);
    });
    */
    console.log(socket);

    



    socket.on('clientNodes', (data) => {
        cnodeArr = data.arr;
        clients = [];
        cnodeArr.forEach(c => {
            let cl = new ClientNode(c.x, c.y, c.z, c.id, c.index);
            clients.push(cl);
        });
        /*
        console.log("CLIETNS ARR: " + clients);
        console.log(cnodeArr);
        console.log("UPDATE INDEX? : " + data.updateIndex);
        */
        if (data.updateIndex) {
            //clients.splice(data.lastDeletedIndex, 1);
            console.log("CLIENTS ARR: " + clients);
            
            for (let i = 0; i < cnode.receivedMessageData.length; i++) {
                if (data.lastDeletedIndex < cnode.receivedMessageData[i].index) cnode.receivedMessageData[i].index--;
                else if (data.lastDeletedIndex == cnode.receivedMessageData[i].index) cnode.receivedMessageData.splice(i, 1);
            }
            
            if (data.lastDeletedIndex < clientIndex) clientIndex--;
            //else if (data.lastDeletedIndex == clientIndex) 
            /*
            clients.forEach(c => {  
                for(let i = 0; i < c.receivedMessageData.length; i++){
                    if (data.lastDeletedIndex < c.receivedMessageData[i].index) c.receivedMessageData[i].index--;
                    // might have to splice rest of the arrays
                    else if (data.lastDeletedIndex == c.receivedMessagesData[i].index) c.receivedMessageData.splice(i, 1);
                }
            });
            */
        }
    });
    socket.on('newClientNode', (data) => {
        cnode = new ClientNode(data.x, data.y, data.z, data.id, data.index);
        clientIndex = data.index;
        //console.log(clientIndex);
    });
    /*
  socket.on('updateIndex', (data) => {
    console.log(data + " AAAA");
    if (typeof cnode !== "undefined") cnode.index = data;
  });
*/
    socket.on('newMessage', (data) => {
        /*
          cnode.displayReceivedMessage = true;
          cnode.receivedMessageData.push({
            msg: data.msg,
            index: data.index // index corresponding to cnodeArr
          });
          cnode.receivedMessagesCopy.push('');
          //console.log(data);
          //console.log("DIST " + dist(cnode.xpos, cnode.ypos, cnode.ypos,
          //  data.x, data.y, data.z));
          cnode.distancesFromReceivedNode.push(dist(cnode.xpos, cnode.ypos, cnode.ypos,
            data.x, data.y, data.z));
          cnode.receivedMessagesCopyIndices.push(data.msg.length - 1);
          cnode.charDeletionNums.push(0);
          console.log("RCVMSG: " + cnode.receivedMessageData);
          */
        // if (typeof data.msg !== "undefined") {
        // console.log("RECEIVED: " + data.msg);
        //}
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].index != data.index) {
                clients[i].displayReceivedMessage = true;
                clients[i].receivedMessageData.push({
                    msg: data.msg,
                    index: data.index // index corresponding to cnodeArr
                });
                clients[i].receivedMessagesCopy.push('');
                //console.log(data);
                //console.log("DIST " + dist(cnode.xpos, cnode.ypos, cnode.ypos,
                //  data.x, data.y, data.z));
                clients[i].distancesFromReceivedNode.push(dist(clients[i].xpos, clients[i].ypos, clients[i].ypos,
                    data.x, data.y, data.z));
                clients[i].receivedMessagesCopyIndices.push(data.msg.length - 1);
                clients[i].charDeletionNums.push(0);
                clients[i].charPushedNums.push(0);
                clients[i].interruptFlags.push(false);
            }
        }
    });


}


function mouseDragged() {
    /*
    //console.log(mouseX + ', ', + mouseY);
    var data = {
      x: mouseX,
      y: mouseY
    }
    // mouse is the name of the message sent to the server
    socket.emit('mouse', data);

    noFill();
    stroke(255);
    var size = noise(frameCount * 0.1) * 50;
    ellipse(mouseX, mouseY, size, size);
    noStroke();
    */
}

function draw() {
    /*
      if (typeof cnode !== "undefined" ){
        console.log(cnode.sendMessage);
        if (cnode.sendMessage) {
          cnode.modifyCopiedMessage();
          //console.log(cnode.messageCopy);
          var msgData = {
                x: cnode.xpos,
                y: cnode.ypos,
                msg: cnode.messageCopy
          };
          socket.emit('newMessage', msgData);
        }
      }
      */
    background(0);

    /*
  fill(uColor);
  if (typeof socket.id !== "undefined") text("ID: " + socket.id, 10, 20);
  noFill();


 
  data2.x = mouseX;
  data2.y = mouseY;
  data2.id = socket.id;

  socket.emit('update', data2);
  */

    rotateX(frameCount * 0.01);
    try{
    clients.forEach(cnode => {
        if (typeof cnode !== "undefined") {
            cnode.display();
            if (cnode.displayReceivedMessage) {
                /*
                cnode.receivedMessagesCopy.forEach(s => {
                  push();
                  rotateX(-frameCount * 0.01);
                  //console.log(s.msg + " " + s.index);
                  text(s, 0,  0);
                  //sphere(100);
                  pop();
                });
                */
                // for each received message data
                try{
                    
                for (let i = 0; i < cnode.receivedMessageData.length; i++) {

                    push();
                    //rotateX(-frameCount * 0.01);

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
            } catch(err){

            }
            }
        }
    });
    } catch(err){

    }

    /*
    if (typeof cnodeArr !== "undefined") {
        cnodeArr.forEach(c => {
            push();
            translate(c.x, c.y, c.z);
            noStroke();
            fill(255);
            sphere(12, 12, 10);
            if (typeof c.id !== "undefined") {
                //rotateX(-frameCount * 0.01);
                text("ID: " + c.id.toString(), -120, -20);
            }
            pop();
        });
        //console.log(cnodeArr);
    }
    */


}

function keyPressed() {
    switch (keyCode) {
        case ENTER:
            var msgData = {
                x: cnode.xpos,
                y: cnode.ypos,
                z: cnode.zpos,
                msg: cnode.message,
                index: cnode.index,
                sendTo: [0, 1] // indices of clients to which the message is sent
            };

            cnode.sendMessage = true;
            socket.emit('newMessage', msgData);
            //console.log(msgData);
            break;
    }
}