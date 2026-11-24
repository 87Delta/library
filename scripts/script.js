//not in use at the moment
/* function sandwichBar() {
  var x = document.getElementById("sandwich");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
*/


//This may need to be changed to assoc. email with username
const loginForm = document.getElementById('email'); 
const userInput = document.getElementById('Fname')

function signUpBtnClick() {
  displaySignUp();
}

function displaySignUp() {
  document.querySelector(".signupCard").style.display = "grid"; 
  document.querySelector(".loginCard").style.display = "none"; 
  document.querySelector("#account").style.display = "none";
}

function logInBtnClick(){
  displayLogIn()
}

function displayLogIn(){
  document.querySelector(".loginCard").style.display = "grid";
  document.querySelector(".signupCard").style.display = "none";
  document.querySelector("#account").style.display = "none";
}

//handles change library Name
function userLibrary(){

}


//change background image to match time of day
const timeOfDay = new Date().getHours();
const libraryBackground = document.querySelector('.library-hero')
const imageBase = new URL("../assests/images/", document.currentScript.src);
const imageUrl = (filename) => new URL(filename, imageBase).href;

function changeBackground () {
if (timeOfDay >= 7 && timeOfDay < 17 ) {
  //libraryBackground.style.backgroundImage = 'url("../assests/images/libraryFullCover_Day.png")'
  libraryBackground.style.backgroundImage = `url("${imageUrl("libraryFullCover_Day.png")}")`;
}

else if (timeOfDay >= 18 || timeOfDay < 6) {
  //libraryBackground.style.backgroundImage = 'url("../assests/images/frontLibrary_night.png")'
  libraryBackground.style.backgroundImage = `url("${imageUrl("frontLibrary_night.png")}")`;
  //document.querySelectorAll(".toplinks a").style.color = "white"; needs to be updated to change text so that it is visible
}

else {
  //libraryBackground.style.backgroundImage = 'url("../assests/images/frontLibrary_morning_afternoon.jpg")'
  libraryBackground.style.backgroundImage = `url("${imageUrl("frontLibrary_morning_afternoon.jpg")}")`;
}
}

changeBackground();

//For animation of the leaves - Wind element written by AI 
const container = document.querySelector("#leaf-container");

const leafImages = [
//"../assests/images/leaf-orange.png",
imageUrl("leaf-orange.png"),
//"../assests/images/leaf-red.png",
imageUrl("leaf-red.png"),
//"../assests/images/leaf-green.png",
imageUrl("leaf-green.png"),
//"../assests/images/leaf-gold.png",
imageUrl("leaf-gold.png"),
//"../assests/images/leaf-pink.png"
imageUrl("leaf-pink.png"),
];

const leaves = [];
let wind = 0;
let targetWind = 0;

// Track mouse position for cursor wind push
const mouse = { x: -1000, y: -1000 };
window.addEventListener("mousemove", (e) => {
mouse.x = e.clientX;
mouse.y = e.clientY;
});

// Periodically change wind direction and strength (gusts)
function updateWind() {
// Random breeze between -1.5 (left) and +2.5 (right)
targetWind = (Math.random() - 0.35) * 3.5;

// Schedule next wind shift in 2 to 5 seconds
setTimeout(updateWind, Math.random() * 3000 + 2000);
}
updateWind();

function spawnLeaf() {
const el = document.createElement("img");
el.src = leafImages[Math.floor(Math.random() * leafImages.length)];
el.classList.add("falling-leaf");

const size = Math.floor(Math.random() * 24) + 24; // 24px to 48px
el.style.width = `${size}px`;
el.style.height = "auto";
container.appendChild(el);

leaves.push({
  el,
  // Spawn slightly wider than viewport so wind doesn't leave empty edges
  x: Math.random() * (window.innerWidth + 200) - 100,
  y: -50,
  vx: 0,
  vy: Math.random() * 1.2 + 1.2, // Fall speed
  rotation: Math.random() * 360,
  rotationSpeed: (Math.random() - 0.5) * 3,
  swayOffset: Math.random() * Math.PI * 2,
  swaySpeed: Math.random() * 0.03 + 0.02,
  // Lighter/smaller leaves get pushed harder by wind
  windFactor: (48 / size) * 0.6
});
}

function animateLeaves() {
// Smoothly interpolate current wind toward target gust
wind += (targetWind - wind) * 0.015;

for (let i = leaves.length - 1; i >= 0; i--) {
  const leaf = leaves[i];

  // 1. Natural sine-wave flutter
  leaf.swayOffset += leaf.swaySpeed;
  const flutter = Math.sin(leaf.swayOffset) * 1.2;

  // 2. Apply wind force based on leaf weight/size
  const windPush = wind * leaf.windFactor;

  // 3. Cursor repulsion (swirl leaves away from pointer)
  const dx = leaf.x - mouse.x;
  const dy = leaf.y - mouse.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 120) {
    const force = (120 - dist) / 120;
    leaf.vx += (dx / dist) * force * 0.6;
    leaf.vy += (dy / dist) * force * 0.3;
  }

  // Apply friction to extra velocity
  leaf.vx *= 0.94;
  // Restore steady downward fall speed if pushed upward
  leaf.vy += (1.5 - leaf.vy) * 0.02;

  // Update position and rotation
  leaf.x += flutter + windPush + leaf.vx;
  leaf.y += leaf.vy;
  leaf.rotation += leaf.rotationSpeed + windPush * 1.5;

  // Render via GPU transform
  leaf.el.style.transform = `translate3d(${leaf.x}px, ${leaf.y}px, 0) rotate(${leaf.rotation}deg)`;

  // Remove leaf once it falls below screen
  if (leaf.y > window.innerHeight + 60) {
    leaf.el.remove();
    leaves.splice(i, 1);
  }
}

requestAnimationFrame(animateLeaves);
}

// Start animation loop and spawn timer
animateLeaves();
setInterval(spawnLeaf, 400);
