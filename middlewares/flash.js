// flash.js middleware
const flash = (req, res, next) => {
  // Initialize flash messages array if not already present in session
  req.session.flashMessages = req.session.flashMessages || [];

  // Add flash function to request object
  req.flash = (type, message) => {
    req.session.flashMessages.push({ type, message });
  };

  // Expose flash messages to views and remove them from session
  res.locals.flashMessages = req.session.flashMessages;
  req.session.flashMessages = [];

  // Call the next
  next();
};

module.exports = flash;
