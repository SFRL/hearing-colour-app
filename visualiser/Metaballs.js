// ########################################################## //
// #                                                        # //
// #        A 2D Metaball implementation using WEBGL        # //
// #       The ball movement is calculated on the CPU       # //
// #      and redering is done via a shader on the GPU      # //
// #                                                        # //
// ########################################################## //
// #                                                        # //
// #                Written by Fabian Kober                 # //
// #                  fabian-kober@gmx.net                  # //
// #                Modified by Sebastian Lobbers           # //
// ########################################################## //

// Initialise Firebase databse
const db = firebase.database();

// simulation speed, can be changed via the real time menu
const speed = 0.5;

// scale factor of the distance field, can be changed via the real time menu
let distScale = 10;

// max radius of the balls, can be changed via the real time menu
let maxRadius = 5;

// Time milliseconds before blob is faded out
const FADE_OFFSET = 60000;
// Time for blob to fade out 1/milliseconds
const FADE_SPEED = 1 / 10000;

// Dict to hold ball instances, keys are userIDs
let balls = {};
// Convert HSB to RGB
// 0 <= h <= 360
// 0 <= s <= 100
// 0 <= b <= 100
const HSBToRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [f(5), f(3), f(1)];
};

const getColour = (hslString) => {
  // Get rgb values from hsl string
  const colourVals = hslString.replace(/[^.0-9]/g, "_").split(/[_]+/);
  const [r, g, b] = HSBToRGB(colourVals[1], colourVals[2], colourVals[3]);
  return [r, g, b];
};
// Randomly get a - or + sign
const getSign = () => {
  const sgn = Math.sign(random(-1, 1));
  return sgn !== 0 ? sgn : 1;
};

// Get a random x and y velocity where speed is always 1
const getVel = () => {
  const velx = getSign() * Math.random(0.1, 1);
  const vely = getSign() * (1 - velx * velx);
  return { x: velx, y: vely };
};
//Define function to update blob colours from firebase data
const updateBlobData = (data) => {
  // Temp dict with newBalls, to account for balls that might have been deleted
  const newBalls = {};
  // Create counter
  let counter = 0;
  for (let id in data) {
    const hslString = data[id]["colour"];
    // Deconstruct hsl string to get numeric values

    // If id is already in ball dictionary, update attributes
    if (id in balls) {
      // Only do something if data has actually changed
      if (balls[id].timestamp !== data[id].timestamp) {
        const vel = getVel();
        const [r, g, b] = getColour(hslString);
        balls[id].vel = vel;
        balls[id].r = r;
        balls[id].g = g;
        balls[id].b = b;

        balls[id].timestamp = data[id]["timestamp"];
        balls[id].updateFade();
      }
      newBalls[id] = balls[id];
    } else {
      // If id is not in dict, add new blob
      const vel = getVel();
      const [r, g, b] = getColour(hslString);
      newBalls[id] = new Ball(
        random(window.innerWidth),
        random(window.innerHeight),
        vel,
        maxRadius,
        r,
        g,
        b,
        data[id]["timestamp"],
        1
      );
    }

    //Update counter
    counter++;
    // Maximum number of blobs is 100
    if (counter >= 100) break;
  }
  balls = newBalls;
};

// Call updateBlobData function everytime the entry on the database changes
const blobRef = db.ref("currentBlobs");

blobRef.on("value", (snapshot) => {
  updateBlobData(snapshot.val());
});

// the shader to render the metaballs
let sh;

// Define ball class
class Ball {
  constructor(x, y, vel, radius, r, g, b, time) {
    this.x = x;
    this.y = y;
    this.vel = vel;
    this.radius = radius;
    this.r = r;
    this.g = g;
    this.b = b;
    this.timestamp = time;
    this.fadeFactor = 1;
  }

  updatePos(speed, limX, limY) {
    //   Reverse velocity if limites are reached
    this.vel.x = this.x <= 0 || this.x >= limX ? this.vel.x * -1 : this.vel.x;
    this.vel.y = this.y <= 0 || this.y >= limY ? this.vel.y * -1 : this.vel.y;
    this.x += this.vel.x * speed;
    this.y += this.vel.y * speed;
  }

  updateFade() {
    const d = new Date();
    const currentTime = d.getTime();
    // Calculate fadeout after time threshold has been reached
    this.fadeFactor = Math.max(
      1 - FADE_SPEED * Math.max(currentTime - this.timestamp - FADE_OFFSET, 0),
      0
    );
  }
}

function setup() {
  // create the WEBGL canvas and the shader
  createCanvas(windowWidth, windowHeight, WEBGL);
  sh = createShader(vert, frag);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // simulate
  updateBalls();

  // set the shader and all uniforms
  shader(sh);
  const ballsX = [];
  const ballsY = [];
  // const radii = [];
  const r = [];
  const g = [];
  const b = [];
  for (let id in balls) {
    const ball = balls[id];
    ballsX.push(ball.x);
    ballsY.push(ball.y);
    // radii.push(ball.radius);
    r.push(ball.r * ball.fadeFactor);
    g.push(ball.g * ball.fadeFactor);
    b.push(ball.b * ball.fadeFactor);
  }

  sh.setUniform("u_ballsX", ballsX);
  sh.setUniform("u_ballsY", ballsY);
  //   sh.setUniform("u_radii", radii);
  sh.setUniform("u_r", r);
  sh.setUniform("u_g", g);
  sh.setUniform("u_b", b);
  sh.setUniform("u_balls", ballsX.length);
  sh.setUniform("u_distScale", distScale);
  //   sh.setUniform("u_colorOffset", colorOffset);
  sh.setUniform("u_radius", maxRadius);
  sh.setUniform("u_width", width);
  sh.setUniform("u_height", height);

  // render a quad with the shader
  quad(-1, -1, -1, 1, 1, 1, 1, -1);
}

// simulate the ball movement
function updateBalls() {
  const deleteBalls = {};
  for (let id in balls) {
    balls[id].updatePos(speed, width, height);
    balls[id].updateFade();
    // Remove balls from database that have faded out
    if (balls[id].fadeFactor === 0) deleteBalls[`currentBlobs/${id}`] = null;
  }
  db.ref().update(deleteBalls);
}

// Handle key events to reset data
function keyTyped() {
  // Delete all entries
  if (key === "x") db.ref().remove();
  // Delete all current blobs, but keep other entries
  if (key === "r") blobRef.remove();

  // Adjust blob size
  if (key === "-") {
    maxRadius = max(0, maxRadius - 0.5);
    distScale = maxRadius * 2;
  }
  if (key === "+") {
    maxRadius = max(0, maxRadius + 0.5);
    distScale = maxRadius * 2;
  }
}
