// authMiddleware.js
const authenticate = (req, res, next) => {
  // Your authentication logic goes here
  // For example, check for a valid token, session, or any other authentication mechanism
  if (req.headers.authorization) {
    next(); // Move on to the next middleware or route handler
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticate;
