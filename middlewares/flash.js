module.exports = (req, res, next) => {
  console.log("Flash middleware executed");
  req.flash = function (type, messages) {
    req.session.flashMessages = { type, messages };
  };
  next();
};
