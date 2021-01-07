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
    
    this.receivedMessages = []; // obj ( msg & clientNode index)
    this.receivedMessagesCopy = []; // msg only
    this.receivedMessagesCopyIndices = []; // keeping track of indices
  }

  modifyCopiedMessage(){
   
    for (let i = 0; i < this.receivedMessagesCopy.length; i++){
      console.log("MOD");
      console.log(this.receivedMessagesCopy[i] + " " + this.receivedMessages[i].msg.length);
      if (this.receivedMessagesCopy[i].length < this.receivedMessages[i].msg.length){
        this.receivedMessagesCopy[i] = 
          this.receivedMessages[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
        this.receivedMessagesCopyIndices[i]--;
        console.log(this.receivedMessagesCopy[i]);
      }
      else {

        this.receivedMessagesCopy.splice(i, 1);
        this.receivedMessagesCopyIndices.splice(i, 1);
        this.receivedMessages.splice(i, 1);
      }
    }
  }

  display(){
    fill(255);
    push();
    translate(this.xpos, this.ypos, this.zpos)
    sphere(10);

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
function preload(){
  font = loadFont('assets/helvetica.ttf');
}
function setup() {
  createCanvas(800, 800, WEBGL);
  textFont(font);
  textSize(10);
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
      cnode.receivedMessages.push({
        msg: data.msg,
        index: data.index
      });
      cnode.receivedMessagesCopy.push('');
      cnode.receivedMessagesCopyIndices.push(data.msg.length - 1);
      console.log("RCVMSG: " + cnode.receivedMessages);
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
  background(200);
  
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

      cnode.receivedMessagesCopy.forEach(s => {
        push();
        rotateX(-frameCount * 0.01);
        //console.log(s.msg + " " + s.index);
        text(s, 0,  0);
        //sphere(100);
        pop();
      });
      cnode.modifyCopiedMessage();
    }
  }
  if (typeof cnodeArr !== "undefined"){
    cnodeArr.forEach(c => {
      push();
      translate(c.x, c.y, c.z);
      fill(0);
      sphere(24, 24, 10);
      if (typeof c.id !== "undefined") {
        rotateX(-frameCount * 0.01);
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
          msg: cnode.message,
          index: cnode.index
      };
      
      cnode.sendMessage = true;
      socket.emit('newMessage', msgData);
      console.log(msgData);
      break;
  }
}
