const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password, role });

  if (user) {
    res.status(201).json({ message: "User created successfully" });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

const fetchUser = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const fetchUsers = async (req, res) => {
  const users = await User.find().select("-password");

  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }

  res.json(users);
};

module.exports = { loginUser, registerUser, fetchUser, fetchUsers };
