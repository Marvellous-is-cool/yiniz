const pool = require("../../models/connection");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = "SELECT * FROM roftfsbore_admins WHERE username = ?";
    const [results] = await pool.execute(query, [username]);

    if (results.length === 0) {
      return res.status(401).send("Invalid credentials"); // If user is not found
    }

    const admin = results[0];

    // Directly compare the plain text password
    if (password !== admin.password) {
      return res.status(401).send("Invalid credentials"); // If password does not match
    }

    // Set session variables or token for logged-in user
    req.session.admin = admin; // Storing admin details in session

    // Redirect to the videos page
    res.redirect("/admin/games/roftfsbore/app/admin/videos");
  } catch (err) {
    console.error("Error during database query:", err);
    return res.status(500).send("Server error");
  }
};

const showLoginPage = async (req, res) => {
  try {
    res.render("games/roftfsbore/admin/login");
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  handleLogin,
  showLoginPage,
};
