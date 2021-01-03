var socket;
var uColor;
var data2;
function setup() {
  createCanvas(800, 800);
  
  socket = io(); //  or http://127.0.0.1:3000
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
  console.log(socket);

  textSize(15);


}

function mouseDragged(){
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
}

function draw() {
  background(0, 10);
  fill(uColor);
  if (typeof socket.id !== "undefined") text("ID: " + socket.id, 10, 20);
  noFill();


  data2.x = mouseX;
  data2.y = mouseY;
  data2.id = socket.id;

  socket.emit('update', data2);
}
