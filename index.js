import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { checkAuth, handleValidation } from "./utils/index.js";

import {
  postCreateValidation,
  registerValidation,
  loginValidation,
} from "./validations.js";

import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://Ranil2086:Ranil2086@cluster0.p8zfpev.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log("Error with connecting to DB", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.post(
  "/auth/login",
  loginValidation,
  handleValidation,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidation,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/uploads", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTag);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidation,
  PostController.create
);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidation,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server is running correct");
});
