const root = document.documentElement;
const beams = document.getElementsByClassName("beam");
const submit = document.getElementById("submit");
const eyes = document.getElementsByClassName("eyeball");
const passwordInputs = document.getElementsByClassName("password");

root.addEventListener("mousemove", (e) => {
  let rect = beams[0].getBoundingClientRect();
  let mouseX = rect.right + rect.width / 2;
  let mouseY = rect.top + rect.height / 2;
  let rad = Math.atan2(mouseX - e.pageX, mouseY - e.pageY);
  let degrees = rad * (20 / Math.PI) * -1 - 350;

  root.style.setProperty("--beamDegrees", `${degrees}deg`);
});

let eyeStates = []
for (let i = 0; i < eyes.length; i++) {
  eyeStates.push(0);

  eyes[i].addEventListener("click", (e) => {
    e.preventDefault();

    eyeStates[i] = eyeStates[i] == 1 ? 0 : 1;
    if (eyeStates.reduce((a, b) => a + b) == 0) {
      document.body.classList.remove("show-password");
    } else {
      document.body.classList.add("show-password");
    }
    
    passwordInputs[i].type = passwordInputs[i].type === "password" ? "text" : "password";
    passwordInputs[i].focus();
    beams[i].classList.toggle("active");
  });
}

function validateAuthForm() {
  const email = document.forms["authForm"]["email"].value;
  if (String(email).indexOf("@") == -1) {
    alert("Invalid email");
    return false;
  }

  const password = document.forms["authForm"]["password"].value;
  if (password.lenght == 0) {
    alert("The password bar cannot be empty!!!(((");
    return false;
  }

  if (document.forms["authForm"]["retype"]) {
    const retype = document.forms["authForm"]["retype"].value;
    
    if (password !== retype) {
      alert("Password or email is incorrect,check again please");
      return false;
    }
  }

  return true;
}

function redirectToHomePage() {
  window.location.href = "/";
}