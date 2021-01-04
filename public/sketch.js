var socket;
var uColor;
var data2;
var clientNodes;
var font;
class ClientNode{
  constructor(xpos, ypos, zpos, id){
    this.xpos = xpos;
    this.ypos = ypos;
    this.zpos = zpos;
    this.id = id;
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
    cnode = new ClientNode(data.x, data.y, data.z, data.id);
  });
  socket.on('clientNodes', (data) => {
    cnodeArr = data.arr;
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
      sphere(10);
      if (typeof c.id !== "undefined") {
        rotateX(-frameCount * 0.01);
        text("ID: " + c.id.toString(), -120, -20);
      }
      pop();
    });
    //console.log(cnodeArr);
  }
}
