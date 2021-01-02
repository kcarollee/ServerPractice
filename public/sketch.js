var socket;

function setup() {
  createCanvas(600, 600);

  socket = io.connect('http://localhost:3000'); //  or http://127.0.0.1:3000
  socket.on('mouse', (data) => {
    noFill();
    var size = noise(frameCount * 0.1) * 50;
    ellipse(data.x, data.y, size, size);
  });
  console.log(socket);

  textSize(15);
}

function mouseDragged(){
  console.log(mouseX + ', ', + mouseY);
  var data = {
    x: mouseX,
    y: mouseY
  }
  // mouse is the name of the message sent to the server
  socket.emit('mouse', data);

  noFill();
  var size = noise(frameCount * 0.1) * 50;
  ellipse(mouseX, mouseY, size, size);
}

function draw() {
  background(220, 0);
  fill(0);
  text("ID: " + socket.id, 10, 20);
  noFill();
}
