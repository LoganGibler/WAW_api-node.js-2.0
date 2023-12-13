// authMiddleware.js
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const Users = require("./db/usersModel");

const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"];
  const user_id = req.headers["user_id"];
  // console.log("req.headers: ", req.headers);
  // console.log("sessionToken: ", token);
  // console.log("user_id ", user_id);

  let username = await Users.findOne({ _id: user_id });
  if (username === null) {
    return res.status(403).send("No user found.");
  }
  username = username.username;

  // console.log("username: ", username);

  if (typeof token !== "undefined") {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
      if (err) {
        console.info("token did not work");
        return res.status(403).send("Error");
      }
      // console.log(decodedToken, "!!!!!!!!!");
      if (decodedToken.username !== username) {
        console.log("Token is invalid.");
        return res.status(403).send("Error");
      }
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
