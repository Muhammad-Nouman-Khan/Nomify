import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import upsertStreamUser from "../utils/stream.js";
export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists, please user a different email",
      });
    }
    const index = Math.floor(Math.random() * 100) + 1; //random number between 1 and 100
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });
    try {
      await upsertStreamUser({
        id: newUser._id,
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created successfully ${newUser._id}`);
    } catch (error) {
      console.log("Error Creating Stream User", error);
    }

    //jwt.sign have 3 parts : payload,secretkey,options
    //payload : data that we want to store in the token
    //secretkey : secret key that we use to sign the token
    //options : options for the token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    //res.cookie is used to set the cookie in the response header and it is used to store the token in the browser
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      httpOnly: true, //prevents client side js from accessing the cookie
      sameSite: "strict", //prevents csrf attacks
      secure: process.env.NODE_ENV === "production", //true in production
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout Successful" });
};
