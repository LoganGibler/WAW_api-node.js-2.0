// authMiddleware.js
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const Users = require("./db/usersModel");

const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"];
  const user_id = req.headers["user_id"];

  // console.log("token: ", token);
  // console.log("user_id: ", user_id);

  let username = await Users.findOne({ _id: req.headers.user_id });
  // console.log("foundUser:", username)
  if (username === null) {
    return res
      .status(403)
      .send("Error Authenticating. No user has been found.");
  }
  let adminStatus = username.admin;

  username = username.username;

  // console.log("username: ", username);

  if (typeof token !== "undefined") {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
      if (err) {
        console.info("token did not work");
        return res.status(404).send("Error");
      }
      // console.log(decodedToken, "!!!!!!!!!");
      if (decodedToken.username !== username) {
        console.log("Token is invalid.");
        return res.status(405).send("Error");
      }
      req.token = token;
      req.decodedToken = decodedToken;
      req.user_id = user_id;
      req.adminStatus = adminStatus;
      // console.log("Token is good. Moving on.");
      // console.log("req", req);
      next();
    });
  } else {
    res.sendStatus(406);
  }
};

module.exports = authenticate;
