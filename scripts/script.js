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

function changeBackground () {
  if (timeOfDay >= 7 && timeOfDay < 17 ) {
    libraryBackground.style.backgroundImage = 'url("../assests/images/libraryFullCover_Day.png"'
  }
  else if (timeOfDay >= 20 || timeOfDay < 7){
    libraryBackground.style.backgroundImage = 'url("../assests/images/frontLibrary_night.png"'
  }
  else {
  libraryBackground.style.backgroundImage = 'url("../assests/images/frontLibrary_morning_afternoon.jpg"'
  console.log("im here")
  }
}

changeBackground();
