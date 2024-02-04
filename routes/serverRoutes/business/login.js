const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const checkValidators = require("../../../middlewares/checkValidators");

router.get("/login", (req, res) => {
  res.render("business/seller/login", { flashMessages: req.flashMessages });
});

router.post(
  "/login",
  [
    check("loginUsername").notEmpty().withMessage("Username is required"),
    check("loginPassword").notEmpty().withMessage("Password is required"),
  ],
  checkValidators,
  (req, res) => {
    // Your login logic here
    // ...

    res.redirect("/dashboard");
  }
);

module.exports = router;
