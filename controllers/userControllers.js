const Users = require("../db/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtsecret = process.env.JWT_SECRET;
// const mongoose = require("mongoose");
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await Users.find({});
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// unprotected routes
exports.createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    const userCheck = await Users.findOne({ username });
    if (userCheck) {
      return res.status(400).json({ message: "Username already exists." });
    }
    const salt = await bcrypt.genSalt();
    console.log("salt:", salt);

    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await Users.create({
      username: username,
      password: hashedPassword,
    });
    // console.log("Registered user:", user);
    res.status(200).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "user creation failed." });
  }
};

const MAX_FAILED_ATTEMPTS = 3; // Adjust the maximum allowed failed attempts
const LOCKOUT_DURATION_MINUTES = 5; // Adjust the lockout duration in minutes

exports.loginUser = async (req, res) => {
  let { username, password } = req.body;
  try {
    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(402).json({ message: "Invalid credentials." });
    }

    // Check if the account is locked
    if (
      user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS &&
      user.lockedUntil > Date.now()
    ) {
      const remainingTime = Math.ceil(
        (user.lockedUntil - Date.now()) / (60 * 1000)
      ); // in minutes
      return res.status(429).json({
        message: `Account locked. Try again in ${remainingTime} minutes.`,
      });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(403).json({ message: "Invalid credentials." });
      }

      if (result) {
        // Reset failed login attempts upon successful login
        const filter = { username: username };
        const update = { failedLoginAttempts: 0, lockedUntil: null };

        const resetUser = Users.updateOne(filter, update);
        res.status(200).json("yaya")
        // console.log("This user has been reset: ", resetUser.username);
        // if (resetUser){

        // }
        // Users.updateOne(filter, update)
        //   .then(() => {
        //     const token = jwt.sign({ username }, jwtsecret, {
        //       expiresIn: "12h",
        //     });
        //     console.log("token:", token);
        //     return res.cookie("auth", token).json({ token });
        //   })
        //   .catch((error) => {
        //     return res
        //       .status(500)
        //       .json({ message: "Error updating user data. 1111" });
        //   });
      } else {
        // Increment failed login attempts
        const newFailedAttempts = user.failedLoginAttempts + 1;
        let update = { failedLoginAttempts: newFailedAttempts };
        let filter = { username: username };
        // Lock the account if max failed attempts reached
        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockoutDuration = LOCKOUT_DURATION_MINUTES * 60 * 1000; // in milliseconds
          const lockedUntil = Date.now() + lockoutDuration;
          update = { ...update, lockedUntil };
        }

        // Update user data
        Users.updateOne(filter, update)
          .then(() => {
            return res.status(404).json({ message: "Invalid credentials." });
          })
          .catch((error) => {
            return res
              .status(500)
              .json({ message: "Error updating user data. 2222" });
          });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login has failed." });
  }
};
