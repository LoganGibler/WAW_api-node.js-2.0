// userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userControllers");
const authenticate = require("../authMiddleware");

// unprotectedRoutes
router.post("/register", UserController.createUser);
router.post("/login", UserController.loginUser);

// protectedRoutes
router.get("/testAuth", authenticate, UserController.testAuth);
router.post("/getUser", authenticate, UserController.getUser);
router.post(
  "/addGuideToBookmarks",
  authenticate,
  UserController.addGuideToBookmarks
);

router.post("/getUserBookmarks", authenticate, UserController.getUserBookmarks);

router.post(
  "/removeGuideFromBookmarks",
  authenticate,
  UserController.removeGuideFromBookmarks
);
module.exports = router;
