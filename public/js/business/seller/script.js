function toggleForms() {
  const loginForm = document.getElementById("loginForm");

  if (loginForm.style.display === "none") {
    loginForm.style.display = "block";
  } else {
    loginForm.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.querySelector(
    "#loginForm button[type='submit']"
  );
  if (loginButton) {
    loginButton.addEventListener("click", function (event) {
      // Check if all fields are filled
      const usernameField = document.getElementById("loginUsername");
      const passwordField = document.getElementById("loginPassword");

      if (!usernameField.value || !passwordField.value) {
        event.preventDefault();
        alert("Please fill in all fields.");
      }
    });
  }

  const signupButton = document.querySelector(
    "#signupForm button[type='submit']"
  );
  if (signupButton) {
    signupButton.addEventListener("click", function (event) {
      // Check if all fields are filled
      const businessNameField = document.getElementById("businessName");
      const signupUsernameField = document.getElementById("signupUsername");
      const categoryField = document.getElementById("category");
      const signupPasswordField = document.getElementById("signupPassword");
      const confirmPasswordField = document.getElementById("confirmPassword");

      if (
        !businessNameField.value ||
        !signupUsernameField.value ||
        categoryField.value === "select" ||
        !signupPasswordField.value ||
        !confirmPasswordField.value
      ) {
        event.preventDefault();
        alert("Please fill in all fields.");
      }
    });
  }
});

toggleForms();
