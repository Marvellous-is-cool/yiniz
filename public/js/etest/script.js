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
    .then((response) => {
      if (response.ok) {
        window.location.href = "/edu/test/welcome";
      } else {
        document.getElementById("loginError").innerText =
          "Invalid username or password";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
