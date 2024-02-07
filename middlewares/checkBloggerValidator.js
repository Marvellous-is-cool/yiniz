// middlewares/checkBloggerValidator.js
const { validationResult, check } = require("express-validator");

exports.loginValidators = [
  check("loginUsername").notEmpty().withMessage("Username is required"),
  check("loginPassword").notEmpty().withMessage("Password is required"),
];

exports.signupValidators = [
  check("regUsername").notEmpty().withMessage("Username is required"),
  check("country").notEmpty().withMessage("Country is required"),
  check("dob").notEmpty().withMessage("Date of Birth is required"),
  check("regPassword").notEmpty().withMessage("Password is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.regPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  } else {
    const errorMessages = errors.array().map((error) => error.msg);
    req.flash("error", errorMessages);
    res.redirect("back");
  }
};
