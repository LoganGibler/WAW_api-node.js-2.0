const User = require("./db/usersModel");
const Post = require("./db/guidesModel");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const guideRoutes = require("./routes/guideRoutes");
require("dotenv").config();

app.enable("trust proxy");
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    // origin: "https://seg-ops-bulletin.netlify.app", // Replace with your client's origin
    origin: "http://localhost:5173",
  })
);

app.use("/users", userRoutes);
app.use("/guides", guideRoutes);

// connecting to DB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("connected to mongodb.");
    });
  })
  .catch((error) => {
    console.log("Error connecting to mongodb", error);
  });
