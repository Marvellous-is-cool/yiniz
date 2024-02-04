module.exports = (req, res, next) => {
  req.flash = function (type, messages) {
    req.session.flashMessages = { type, messages };
  };
  next();
};
