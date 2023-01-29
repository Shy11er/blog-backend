import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { validationResult } from "express-validator";

import UserModel from "./models/User.js";

import { registerValidation } from "./validations/auth.js";

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

app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect password or email",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Incorrect password or email",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.send({ ...userData, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error with authorization user",
    });
  }
});

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Errors with registrarion the user",
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server is running correct");
});
