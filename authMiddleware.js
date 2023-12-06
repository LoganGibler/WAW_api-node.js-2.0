// authMiddleware.js
const authenticate = (req, res, next) => {
  // Your authentication logic goes here
  // For example, check for a valid token, session, or any other authentication mechanism
  const token = req.headers["authorization"];
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
      next();
    });
  } else {
    res.sendStatus(403);
  }
};

module.exports = authenticate;
