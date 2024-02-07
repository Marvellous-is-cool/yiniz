function toggleForm(formId) {
  document.getElementById("loginForm").style.display =
    formId === "loginForm" ? "block" : "none";
  document.getElementById("registerForm").style.display =
    formId === "registerForm" ? "block" : "none";
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  // Make a POST request to the login route
  fetch("/admin/blog/blogger/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ loginUsername: username, loginPassword: password }), // Send username and password in request body
  })
    .then((response) => {
      if (response.ok) {
        // If login is successful, redirect to the blogger home page
        window.location.href = "/admin/blog/blogger/home";
      } else {
        // If there's an error, display an alert message
        throw new Error("Login failed");
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      alert("Invalid username or password");
    });
}

function register() {
  // Prevent default form submission
  event.preventDefault();

  const regUsername = document.getElementById("regUsername").value;
  const country = document.getElementById("country").value;
  const dob = document.getElementById("dob").value;
  const regPassword = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Add client-side validation for registration fields
  if (!regUsername || !country || !dob || !regPassword || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  // Construct a JavaScript object with the form data
  const formData = {
    regUsername,
    country,
    dob,
    regPassword,
    confirmPassword,
  };

  // Make a POST request to the signup route
  fetch("/admin/blog/blogger/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (response.ok) {
        // If signup is successful, redirect to the blogger home page
        window.location.href = "/admin/blog/blogger/home";
      } else {
        // If there's an error, display an alert message
        throw new Error("Signup failed");
      }
    })
    .catch((error) => {
      console.error("Error during signup:", error);
      alert("An error occurred during signup");
    });
}
