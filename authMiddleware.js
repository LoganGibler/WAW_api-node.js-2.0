// authMiddleware.js
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");

const authenticate = (req, res, next) => {
  // Your authentication logic goes here
  // For example, check for a valid token, session, or any other authentication mechanism

  // this may need to be changed to //const token = req.cookies.auth; as this is an httponly cookie, that cannot be grabbed with JS.
  // const token = req.headers["authorization"];
  const token = req.cookies.AUTH_API;
  console.log("bearerHeader: ", token);

  if (typeof token !== "undefined") {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
      if (err) {
        console.info("token did not work");
        return res.status(403).send("Error");
      }
      // console.log(decodedToken, "!!!!!!!!!");
      req.token = token;
      req.decodedToken = decodedToken;
      console.log("Token is good.");
      next();
    });
  } else {
    res.sendStatus(403);
  }
};

module.exports = authenticate;
