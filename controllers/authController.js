const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(email);

    if (!email || !password || !name) {
      // return res.status(400).send("All fields are required");
      return res.status(404).send("All fields are required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      // res.status(409).send("User is already registered");
      return res.status(409).send("User is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // return res.status(201).json({ user });
    return res.status(201).send("User created Successfully");
  } catch (e) {
    return res.status(500).send(500, e.message);
  }
};
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);

    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // return res.status(404).send("User is not found");
      return res.send(error(404, "User is not found"));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(403).send("Incorrect Password");
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    // return res.json({ accessToken, refreshToken });
    return res.status(200).send({ accessToken });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).send("User logged out");
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
//This API will check the refresh token validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    return res.status(401).send("Refresh token in cookie is required");
  }

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });
    return res.status(201).json({ accessToken });
  } catch (e) {
    console.log(e);
    return res.status(401).send("Invalid refresh token");
  }
};

//Internal Functions
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};
const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN, {
      expiresIn: "1y",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  refreshAccessTokenController,
};
