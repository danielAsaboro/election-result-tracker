import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authSchema = new Schema(
  {
    who: {
      type: Schema.Types.UUID,
      ref: function () {
        return this.whoType;
      },
      required: true,
      unique: true,
    },
    whoType: {
      type: String,
      enum: ["Admin", "User", "Editor"],
      default: "User", // Set a default account type
    },
    authType: {
      type: String,
      enum: ["PASSWORD", "FACEBOOK_OAUTH", "GOOGLE_OAUTH"],
      default: "PASSWORD",
    },
    accessToken: {},
    refreshToken: {
      type: String,
    },
    secret: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

authSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.secret = await bcrypt.hash(this.secret, salt);
});

authSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

authSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.secret);
  return isMatch;
};

const Auth = model("auth", authSchema);
export default Auth;
