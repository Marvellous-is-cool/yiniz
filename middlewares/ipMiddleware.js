// middleware/ipMiddleware.js

// Create a middleware function to track IP addresses
const trackIP = (req, res, next) => {
  const clientIP = req.ip; // Access the client's IP address from the request object

  // You can store the IP address in session, database, or any other storage mechanism
  // For simplicity, let's store it in the session
  if (!req.session.ip) {
    req.session.ip = {};
  }
  // Store the IP address
  req.session.ip[clientIP] = true;
  next();
};

module.exports = trackIP;
