// userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userControllers");
const authenticate = require("../authMiddleware");

// unprotectedRoutes
router.post("/register", UserController.createUser);
router.post("/login", UserController.loginUser);

// protectedRoutes
router.get("/testauth", authenticate, UserController.testAuth)

module.exports = router;
