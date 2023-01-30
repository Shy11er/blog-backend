import { body } from "express-validator";

export const registerValidation = [
  body("email", "Wrong email format").isEmail(),
  body("password", "Password must be contain ay least 5 characters").isLength({
    min: 5,
  }),
  body("fullName", "Username must be contain at least 3 characters").isLength({
    min: 3,
  }),
  body("avatarUrl", "Invalid reference to avatarUrl").optional().isURL(),
];

export const loginValidation = [
  body("email", "Wrong email format").isEmail(),
  body("password", "Password must be contain ay least 5 characters").isLength({
    min: 5,
  }),
];

export const postCreateValidation = [
  body("title", "Please enter at least 3 characters").isLength({ min: 3 }),
  body("text", "Please enter at least 5 characters").isLength({ min: 5 }),
  body("tags", "Wrong format of tags").optional().isArray(),
  body("imageUrl", "Wrong reference of imageUrl").optional().isURL(),
];
