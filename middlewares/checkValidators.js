const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  // Check if fields are filled
  const fields = Object.keys(req.body);
  const areFieldsFilled = fields.every((field) => req.body[field]);

  if (errors.isEmpty() && areFieldsFilled) {
    next();
  } else {
    const errorMessages = errors.array().map((error) => error.msg);
    req.flash("error", errorMessages);
    res.redirect("back");
  }
};
