
let walls = [];
let source;
function setup() {
  createCanvas(1000, 1000);

  // random cubes
  for (let i = 0; i < 20; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1+50;
    let y2 = y1;
    let x3 = x1+50;
    let y3 = y1+50;
    let x4 = x1;
    let y4 = y1+50;
    walls.push(new Wall(x1, y1, x2, y2));
    walls.push(new Wall(x2, y2, x3, y3));
    walls.push(new Wall(x3, y3, x4, y4));
    walls.push(new Wall(x4, y4, x1, y1));
  }

  // map edges
  walls.push(new Wall(0, 0, width, 0));
  walls.push(new Wall(width, 0, width, height));
  walls.push(new Wall(0, height, width, height));
  walls.push(new Wall(0, 0, 0, height));

  source = new RaySource();
}

function draw() {

  background(0);
  
  for (let wall of walls) {
    wall.render();
  }

  source.render();
  source.castRays(walls, mouseX, mouseY, 45);
}
