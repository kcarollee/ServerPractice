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
    this.messageCopy = '';
    this.sendMessage = false;
    this.messageCopyIndex = 0;
    
  }

  modifyCopiedMessage(){
   // console.log("MSG: " + this.message);
    //console.log("COPY: " + this.messageCopy);
    if (this.messageCopy.length <= this.message.length){
      
      this.messageCopy += this.message[this.messageCopyIndex];
      this.messageCopyIndex++;
    }
    else {
      //this.sendMessage = false;
      this.messageCopyIndex = 0;
      this.messageCopy = '';
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

   // if (typeof data.msg !== "undefined") {
      console.log("RECEIVED: " + data.msg);
      //push();
      text(data.msg, 0, 0);
      //sphere(100);
      //pop();
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
  if (typeof cnode !== "undefined") cnode.display();
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
          msg: cnode.modifyCopiedMessage
      };
      cnode.sendMessage = true;
      console.log(msgData);
      
      break;
  }
}
