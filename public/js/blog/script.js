// function register() {
//   var regUsername = document.getElementById("regUsername").value;
//   var country = document.getElementById("country").value;
//   var dob = document.getElementById("dob").value;
//   var regPassword = document.getElementById("regPassword").value;
//   var confirmPassword = document.getElementById("confirmPassword").value;

//   console.log("Registration initiated...");

//   // Check if passwords match
//   if (regPassword !== confirmPassword) {
//     document.getElementById("registerError").innerText =
//       "Passwords do not match";
//     console.error("Passwords do not match");
//     return;
//   }

//   console.log("Sending registration request...");

//   fetch("/admin/blog/blogger/signup", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       regUsername: regUsername,
//       country: country,
//       dob: dob,
//       regPassword: regPassword,
//     }),
//   })
//     .then((response) => {
//       console.log("Received response from server:", response);
//       if (response.ok) {
//         console.log("Registration successful. Redirecting...");
//         window.location.href = "/admin/blog/blogger/home";
//       } else {
//         console.error("Failed to sign up. Please try again later.");
//         document.getElementById("registerError").innerText =
//           "Failed to sign up. Please try again later.";
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

function login() {
  var loginUsername = document.getElementById("username").value;
  var loginPassword = document.getElementById("password").value;

  fetch("/admin/blog/blogger/login", {
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
        window.location.href = "/admin/blog/blogger/home";
      } else {
        document.getElementById("loginError").innerText =
          "Invalid username or password";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Preserve existing toggleForm function
function toggleForm(formId) {
  document.getElementById(formId).style.display = "block";
  document.getElementById(
    formId === "loginForm" ? "registerForm" : "loginForm"
  ).style.display = "none";
}
