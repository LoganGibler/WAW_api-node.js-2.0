// userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userControllers");
const authenticate = require("../authMiddleware");

// unprotectedRoutes
router.post("/register", UserController.createUser);
router.post("/login", UserController.loginUser);

// Add more user-related routes as needed

module.exports = router;
