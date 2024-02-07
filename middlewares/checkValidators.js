const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  } else {
    const errorMessages = errors.array().map((error) => error.msg);
    req.flash("error", errorMessages);
    res.redirect("back");
  }
};
