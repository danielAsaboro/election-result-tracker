import User from "../models/User.js";
import Auth from "../models/auth.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
  const { password } = req.body;
  const user = await User.create({ ...req.body });

  if (user) {
    await Auth.create({
      who: user._id,
      whoType: "User",
      authType: "PASSWORD",
      secret: password,
    });
  }

  res.status(StatusCodes.CREATED).json({
    data: {
      user,
    },
    status: true,
    message: "User created successfully",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const auth = await Auth.findOne({ who: user._id });

  //   Compare password
  const isPasswordCorrect = await auth.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid password");
  }
  //   Create token
  const token = auth.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ data: { user }, message: "User Logged in successfully", token });
};

export { register, login };
