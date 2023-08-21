import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import Auth from "../auth.js";

const userSchema = new Schema(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    sex: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "{VALUES} isnt allowed",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    prefix: {
      type: String,
    },
    suffix: {
      type: String,
    },
    role: {
      type: Number,
      default: 1984,
      required: true,
    },
    authType: {
      type: String,
      enum: ["PASSWORD", "FACEBOOK_OAUTH", "GOOGLE_OAUTH"],
      default: "PASSWORD",
      select: false,
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
