var r,g,b
let num = 70;
let mx = [];
let my = [];
var state = false;
let=angle=0;

function setup() {
  createCanvas(windowWidth, windowHeight).parent("landing-page-backdrop");
  angleMode(degrees);
  r= random(255);
  g= random(255);
  b= random(255);
  //noStroke();
  let color = 255;
  stroke(255);
  strokeWeight(3);
  fill('hsla(100, 100%, 100%, 0.5)');

  for (let i = 0; i < num; i++) {
    mx.push(i);
    my.push(i);
  }
}

function draw() {
  state=false;
  background(40);
  color(255);
  
  // Cycle through the array, using a different entry on each frame.
  // Using modulo (%) like this is faster than moving all the values over.
  let which = frameCount % num;
  mx[which] = mouseX;
  my[which] = mouseY;

  for (let i = 0; i < num; i++) {
    // which+1 is the smallest (the oldest in the array)
    let index = (which + 1 + i) % num;
    ellipse(mx[index], my[index], i, i);
  }//end of for(let)
  
}//end of function draw

// When the user clicks the mouse
function mousePressed() {
//ellipse.push(new Ellipse());
  }//end of function mousepressed

