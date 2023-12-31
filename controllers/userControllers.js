const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../db/usersModel");
const Guides = require("../db/guidesModel");
const { default: mongoose } = require("mongoose");

exports.testAuth = async (req, res) => {
  try {
    let userID = req.user_id;
    let username = req.decodedToken.username;
    let adminStatus = req.adminStatus;
    res.status(200).json({
      message: "User is authenticated.",
      userID,
      username,
      adminStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "User is not authenticated." });
  }
};

// unprotected routes
exports.createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(username, password);

    const userCheck = await Users.findOne({ username });
    if (userCheck) {
      return res.status(200).json({ message: "Username already exists." });
    }
    const salt = await bcrypt.genSalt();
    // console.log("salt:", salt);

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
    // console.log("user: ", user);
    const user_id = user._id;
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

    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        return res.status(403).json({ message: "Invalid credentials." });
      }

      if (result) {
        // Reset failed login attempts upon successful login
        const filter = { username: username };
        const updatedData = { failedLoginAttempts: 0, lockedUntil: null };
        const resetUser = await Users.updateOne(filter, updatedData);
        // console.log(process.env.JWT_SECRET);
        // console.log({ username });
        const token = jwt.sign({ username }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        // console.log("Generated Token: ", token);
        res
          .cookie("USER_ID", user_id)
          .cookie("AUTH_API", token)
          .json({ user_id, token })
          .status(200);
      } else {
        const newFailedAttempts = user.failedLoginAttempts + 1;
        let update = { failedLoginAttempts: newFailedAttempts };
        let filter = { username: username };
        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockoutDuration = LOCKOUT_DURATION_MINUTES * 60 * 1000; // in milliseconds
          const lockedUntil = Date.now() + lockoutDuration;
          update = { ...update, lockedUntil };
        }

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

exports.getUser = async (req, res) => {
  // console.log("/getUser req.body: ");
  const userID = req.body._id;

  try {
    const filter = { _id: new mongoose.Types.ObjectId(userID) };
    const foundUser = await Users.findOne(filter);
    // console.log("Here is found user:", foundUser);
    res.status(200).json({ message: "User found.", foundUser });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user data." });
  }
};

exports.addGuideToBookmarks = async (req, res) => {
  try {
    const update = { $push: { bookmarkedGuides: req.body.guide_id } };
    const filter = { _id: req.body._id };
    const addedGuide = await Users.updateOne(filter, update);
    console.log("addedGuide: ", addedGuide);
    addedGuide
      ? res.status(200).json({ message: "Guide added to bookmarks." })
      : res.status(500).json({ message: "Error adding guide to bookmarks." });
  } catch (error) {
    res.status(500).json({ message: "Error adding guide to bookmarks." });
  }
};

exports.getUserBookmarks = async (req, res) => {
  try {
    const userID = req.body._id;
    const filter = { _id: new mongoose.Types.ObjectId(userID) };
    let bookmarks = await Users.findOne(filter);

    console.log("bookmarks: ", bookmarks.bookmarkedGuides);

    bookmarks = bookmarks.bookmarkedGuides;
    res.status(200).json({ message: "User bookmarks retrieved.", bookmarks });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user bookmarks." });
  }
};

exports.getUserBookmarkedData = async (req, res) => {
  try {
    const userID = req.body._id;
    // console.log("Here is userID!!!!:", userID);
    const filter = { _id: new mongoose.Types.ObjectId(userID) };

    let user = await Users.findOne(filter);
    // console.log("getUserBookmarksDAta founduser: ", user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const bookmarks = user.bookmarkedGuides;

    if (bookmarks.length) {
      const foundGuidesPromises = bookmarks.map(async (_id) => {
        const filter = { _id: _id, published: true, approved: true };
        const guideData = await Guides.findOne(filter);
        return guideData;
      });
      const foundGuides = await Promise.all(foundGuidesPromises);
      console.log("foundGuides array:", foundGuides);
      res.status(200).json({
        message: "User bookmarked Guides have retrieved.",
        foundGuides,
      });
    } else {
      res
        .status(200)
        .json({ message: "User has no bookmarked Guides.", foundGuides: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user bookmarks." });
  }
};

exports.removeGuideFromBookmarks = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const update = { $pull: { bookmarkedGuides: req.body.guide_id } };
    const removedGuide = await Users.updateOne(filter, update);
    console.log(removedGuide);
    removedGuide
      ? res.status(200).json({ message: "Guide removed from bookmarks." })
      : res
          .status(500)
          .json({ message: "Error removing guide from bookmarks." });
  } catch (error) {
    res.status(500).json({ message: "Error removing guide from bookmarks." });
  }
};
