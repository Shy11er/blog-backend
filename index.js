import express from "express";
import mongoose from "mongoose";

import checkAuth from "./utils/checkAuth.js";

import { registerValidation } from "./validations/auth.js";

import * as UserController from "./controllers/UserController.js";

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

app.use(express.json());

app.post("/auth/login", UserController.login);

app.post("/auth/register", registerValidation, UserController.register);

app.get("/auth/me", checkAuth, UserController.getMe);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server is running correct");
});
