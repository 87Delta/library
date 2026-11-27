const canvas = document.getElementById("dragonCanvas");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;

function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * pixelRatio);
    canvas.height = Math.round(H * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let dragons = [];
let paused = false;

let speed = 1;
let lastTime = 0;
let nextSpawn = 0;

const random = (min, max) =>
min + Math.random() * (max - min);

// Dragon color variations
const colors = [
{
    body: "#477e69",
    light: "#8ac39a",
    dark: "#234d49",
    wing: "#305e53",
    belly: "#c9ad79"
},
{
    body: "#775d9f",
    light: "#b9a3d8",
    dark: "#44365f",
    wing: "#57467d",
    belly: "#d2bd9a"
},
{
    body: "#aa603d",
    light: "#e8a56a",
    dark: "#653d34",
    wing: "#793e35",
    belly: "#e1bc82"
}
];

// Spawn a new dragon
function spawnDragon() {
const direction =
    Math.random() < 0.5 ? 1 : -1;
const verticalInset = Math.min(90, H / 2);
const dragon = {
    x: direction === 1 ? -140 : W + 140,

    y: random(verticalInset, H - verticalInset),

    direction,

    scale: random(0.78, 1.15),

    phase: random(0, 6),

    fireWait: random(1, 3),

    fire: 0,

    vy: random(-0.3, 0.3),

    color: colors[
        Math.floor(random(0, colors.length))
    ]
};
dragons.push(dragon);
}

// Drawing helper
function pixel(x, y, width, height, color) {
ctx.fillStyle = color;
ctx.fillRect(
    x,
    y,
    width,
    height
);
}

// Polygon drawing helper
function polygon(points, color) {
ctx.fillStyle = color;
ctx.beginPath();
ctx.moveTo(...points[0]);

for (let i = 1; i < points.length; i++) {
    ctx.lineTo(...points[i]);
}
ctx.closePath();
ctx.fill();
}

// Draw and animate an individual dragon
function drawDragon(dragon, dt, time) {
const c = dragon.color;
dragon.phase += dt * 7;
dragon.x +=
    dragon.direction * dt * 66 * speed;

dragon.y += dragon.vy;
const verticalInset = Math.min(90, H / 2);
if (
    dragon.y < verticalInset ||
    dragon.y > H - verticalInset
) {
    dragon.vy *= -1;
}

// Random fire breathing
dragon.fireWait -= dt;
if (
    dragon.fireWait <= 0 &&
    dragon.fire <= 0
) {

    dragon.fire = 0.85;

    dragon.fireWait = random(2, 5);
}
if (dragon.fire > 0) {
    dragon.fire -= dt;
}

// Dragon positioning and direction
ctx.save();
ctx.translate(dragon.x, dragon.y);
ctx.scale(
    dragon.direction * dragon.scale,
    dragon.scale
);

const wing = Math.sin(dragon.phase);
const lift = wing * 15;

// Tail
polygon([
    [-25, 8],
    [-53, 12 + Math.sin(time / 200) * 3],
    [-75, 2 + Math.sin(time / 200) * 4],
    [-57, 22],
    [-32, 19]
], c.dark);

polygon([
    [-60, 9],
    [-76, 2 + Math.sin(time / 200) * 4],
    [-69, 17]
], c.light);

// Rear wing
ctx.save();
ctx.rotate(wing * 0.10);
polygon([
    [-14, -9],
    [-42, -33 - lift],
    [-63, -66 - lift],
    [-55, -23 - lift],
    [-42, -4]
], c.wing);

polygon([
    [-40, -25 - lift],
    [-63, -66 - lift],
    [-59, -32 - lift],
    [-42, -7]
], c.light);

ctx.strokeStyle = c.light;
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(-14, -8);
ctx.lineTo(-63, -66 - lift);
ctx.moveTo(-41, -32 - lift);
ctx.lineTo(-59, -32 - lift);
ctx.stroke();
ctx.restore();

// Legs
polygon([
    [-13, 15],
    [-11, 32],
    [-4, 35],
    [0, 17]
], c.dark);

polygon([
    [14, 13],
    [17, 30],
    [25, 32],
    [26, 13]
], c.dark);

// Belly
polygon([
    [-25, 5],
    [-21, 19],
    [9, 22],
    [27, 7],
    [18, 13],
    [-12, 12]
], c.belly);

// Main body
ctx.beginPath();
ctx.ellipse(
    0, 0, 39, 15,
    0, 0, Math.PI * 2
);
ctx.fillStyle = c.body;
ctx.fill();

// Individual scales
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
        const x =
            -23 + col * 7 + (row % 2) * 3;

        const y = -8 + row * 7;
        pixel(
            x, y, 3, 2,
            row === 0 ? c.light : c.dark
        );
    }
}

// Neck
polygon([
    [20, -9],
    [35, -18],
    [43, -8],
    [39, 8],
    [22, 10]
], c.body);

// Head
polygon([
    [30, -20],
    [39, -26],
    [54, -24],
    [64, -16],
    [66, -8],
    [56, -3],
    [38, -7],
    [29, -12]
], c.body);

// Snout
polygon([
    [45, -7],
    [62, -9],
    [68, -5],
    [62, -1],
    [45, -2]
], c.light);

// Horns
polygon([
    [37, -25],
    [42, -37],
    [46, -26]
], "#e5d5ae");

polygon([
    [50, -24],
    [56, -34],
    [58, -23]
], "#e5d5ae");

// Eyes
pixel(53, -17, 5, 4, "#f7df82");
pixel(56, -17, 2, 4, "#241d28");

// Nostril
pixel(64, -9, 2, 2, c.dark);

// Front wing
ctx.save();
ctx.rotate(-wing * 0.12);
polygon([
    [-9, -8],
    [11, -35 - lift],
    [38, -65 - lift],
    [27, -23 - lift],
    [13, -5]
], c.wing);

polygon([
    [11, -35 - lift],
    [38, -65 - lift],
    [32, -32 - lift],
    [13, -5]
], c.light);

polygon([
    [-9, -8],
    [11, -35 - lift],
    [13, -5]
], c.dark);
ctx.strokeStyle = c.light;
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(-8, -8);
ctx.lineTo(38, -65 - lift);
ctx.moveTo(11, -35 - lift);
ctx.lineTo(32, -32 - lift);
ctx.stroke();
ctx.restore();

// Feet and claws
polygon([
    [-17, 9],
    [-15, 24],
    [-24, 30],
    [-10, 28],
    [-6, 21]
], c.body);

polygon([
    [12, 9],
    [15, 24],
    [8, 30],
    [22, 27],
    [23, 19]
], c.body);

pixel(-24, 28, 5, 2, "#e6c49b");
pixel(19, 27, 5, 2, "#e6c49b");

// Fire breathing animation
if (dragon.fire > 0) {
    const intensity =
        1 - dragon.fire / 0.85;
    ctx.save();
    ctx.translate(64, -5);
    ctx.scale(
        1 + intensity * 0.35,
        1 - intensity * 0.18
    );

    polygon([
        [0, -6],
        [18, -13],
        [35, -7],
        [55, -3],
        [40, 4],
        [20, 7],
        [0, 3]
    ], "#e44b25");

    polygon([
        [0, -3],
        [18, -9],
        [38, -4],
        [52, -3],
        [32, 2],
        [12, 3]
    ], "#ffad35");

    polygon([
        [0, -2],
        [15, -5],
        [31, -3],
        [19, 1]
    ], "#fff1a0");

    polygon([
        [16, -10],
        [27, -18],
        [30, -8]
    ], "#ffce49");

    // Flying embers
    for (let i = 0; i < 5; i++) {
        const ex = random(15, 54);
        const ey = random(-17, 12);
        pixel(
            ex, ey, 3, 3,
            i % 2 ? "#ffd35c" : "#ef622e"
        );
    }
    ctx.restore();
}
ctx.restore();
}

// Background drawing
function drawBackground(time) {
ctx.clearRect(0, 0, W, H);
}

// Main animation loop
function animate(time) {
requestAnimationFrame(animate);
const dt = Math.min(
    (time - lastTime) / 1000,
    0.05
);
lastTime = time;
if (paused) return;
drawBackground(time);

// Automatically spawn dragons
if (
    time > nextSpawn &&
    dragons.length < 2
) {
    spawnDragon();
    nextSpawn =
    time + random(18000, 40000);
}

// Update all dragons
dragons.forEach(dragon => {
    drawDragon(dragon, dt, time);
});

// Remove dragons outside the screen
dragons = dragons.filter(dragon =>
    dragon.x > -180 &&
    dragon.x < W + 180
);
}

// Start animation
spawnDragon();

nextSpawn = performance.now() + 8500;

requestAnimationFrame(animate);
