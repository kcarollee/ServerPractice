var socket;
var uColor;
var data2;
var clientNodes;
var font;
class ClientNode{
  constructor(xpos, ypos, zpos, id, index){
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
  }

  modifyCopiedMessage(){
   
    for (let i = 0; i < this.receivedMessagesCopy.length; i++){
      console.log(this.receivedMessagesCopy[i] + " " + this.receivedMessageData[i].msg.length);
      if (this.receivedMessagesCopy[i].length < this.receivedMessageData[i].msg.length){
        this.receivedMessagesCopy[i] = 
          this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
        this.receivedMessagesCopyIndices[i]--;
        console.log(this.receivedMessagesCopy[i]);
      }
      else { 
        console.log("ELSE " + this.receivedMessagesCopy[i].length * fontSize + 
          " " + this.distancesFromReceivedNode[i]);
        // until *-----string*
        if (this.receivedMessagesCopy[i].length * fontSize * 1.5 < this.distancesFromReceivedNode[i]){
          this.receivedMessagesCopy[i] = ' ' + this.receivedMessagesCopy[i];

        }
        else {
          if (this.charDeletionNums[i] < this.receivedMessageData[i].msg.length){
            this.receivedMessagesCopy[i] = 
              this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
            this.receivedMessagesCopy[i] = ' ' + this.receivedMessagesCopy[i];
            this.charDeletionNums[i]++;
            console.log("SLICED: " + this.receivedMessagesCopy[i] + " " + this.charDeletionNums[i]);
          }
          else {
            this.receivedMessagesCopy.splice(i, 1);
            this.receivedMessagesCopyIndices.splice(i, 1);
            this.receivedMessageData.splice(i, 1);
            this.charDeletionNums[i] = 0;
          }
        }
        /*
        this.receivedMessagesCopy.splice(i, 1);
        this.receivedMessagesCopyIndices.splice(i, 1);
        this.receivedMessageData.splice(i, 1);
        */
      }
    }
  }

  display(){
    noStroke();
    fill(255);
    push();
    translate(this.xpos, this.ypos, this.zpos)
    sphere(12, 12, 10);

    if (typeof this.id !== "undefined") {
      rotateX(-frameCount * 0.01);
      fill(200, 50, 180);
      text("YOUR ID: " + this.id.toString(), -130, -20);
    }
    pop();
  }
}

var cnode;
var cnodeArr;
var fontSize = 10;
function preload(){
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

  textSize(15);


  socket.on('newClientNode', (data) => {
    cnode = new ClientNode(data.x, data.y, data.z, data.id, data.index);
  });
  socket.on('clientNodes', (data) => {
    cnodeArr = data.arr;
    console.log(cnodeArr);
  });
  socket.on('updateIndex', (data) => {
    console.log(data + " AAAA");
    if (typeof cnode !== "undefined") cnode.index = data;
  });

  socket.on('newMessage', (data) => {
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
   // if (typeof data.msg !== "undefined") {
     // console.log("RECEIVED: " + data.msg);
    //}

  });
}


function mouseDragged(){
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
  if (typeof cnode !== "undefined") {
    cnode.display();
    if (cnode.displayReceivedMessage){
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
      for (let i = 0; i < cnode.receivedMessageData.length; i++){
        push();
        //rotateX(-frameCount * 0.01);

        translate(
          cnodeArr[cnode.receivedMessageData[i].index].x,
          cnodeArr[cnode.receivedMessageData[i].index].y,
          cnodeArr[cnode.receivedMessageData[i].index].z
        );

        let vStart = createVector(cnodeArr[cnode.receivedMessageData[i].index].x,
          cnodeArr[cnode.receivedMessageData[i].index].y,
          cnodeArr[cnode.receivedMessageData[i].index].z);
        let vDest = createVector(cnode.xpos, cnode.ypos, cnode.zpos);
        let vDir = p5.Vector.sub(vDest, vStart).normalize();
        let vInit = createVector(1, 0, 0);
        let vBisect = p5.Vector.add(vDir, vInit).normalize();
        rotate(PI, vBisect);
        text(cnode.receivedMessagesCopy[i], 0, 0);
        pop();
      }
      cnode.modifyCopiedMessage();
    }
  }
  if (typeof cnodeArr !== "undefined"){
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

  
  
}

function keyPressed(){
  switch(key){
    case 'n':
      var msgData = {
          x: cnode.xpos,
          y: cnode.ypos,
          z: cnode.zpos,
          msg: cnode.message,
          index: cnode.index
      };
      
      cnode.sendMessage = true;
      socket.emit('newMessage', msgData);
      console.log(msgData);
      break;
  }
}
