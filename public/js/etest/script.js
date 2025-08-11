const hid_show = (elem, opt) => {
  if (opt === "hide") {
    elem.classList.remove("animate__fadeIn");
    elem.classList.add("animate__fadeOut");

    // Delay before hiding the element
    setTimeout(() => {
      elem.style.display = "none";
    }, 500);
  } else if (opt === "show") {
    elem.classList.remove("animate__fadeOut");
    elem.classList.add("animate__fadeIn");
    // Delay before showing the element
    setTimeout(() => {
      elem.style.display = "flex";
      elem.style.flexDirection = "column";
    }, 500);
  }
};

const add_eff2 = (elem, det) => {
  if (det === "s") {
    elem.classList.add("slow-smooth-fade-out-element");
    elem.classList.add("animate__pulse");
  } else if (det === "h") {
    elem.classList.remove("slow-smooth-fade-out-element");
    elem.classList.add("animate__pulse");
  }
};

function login() {
  var loginUsername = document.getElementById("username").value;
  var loginPassword = document.getElementById("password").value;

  fetch("/edu/etest/proceed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      loginUsername: loginUsername,
      loginPassword: loginPassword,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.href = data.redirect;
      } else {
        // Show error message
        const errorElement = document.getElementById("loginError");
        if (errorElement) {
          errorElement.innerText = data.error || "Invalid username or password";
        } else {
          alert(data.error || "Invalid username or password");
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred during login");
    });
}

function togglePasswordVisibility() {
  var passwordField = document.getElementById("password");
  var toggleText = document.getElementById("toggleText");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleText.textContent = "Hide";
  } else {
    passwordField.type = "password";
    toggleText.textContent = "Show";
  }
}
