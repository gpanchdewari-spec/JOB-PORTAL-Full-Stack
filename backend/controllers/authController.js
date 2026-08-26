import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createToken } from "../utils/token.js";

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  headline: user.headline,
  location: user.location,
  skills: user.skills,
  resumeUrl: user.resumeUrl,
});

export const register = async (req, res) => {
  try {
    const { name, email, password, role = "candidate" } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    if (!["candidate", "recruiter"].includes(role)) return res.status(400).json({ message: "Invalid role" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ token: createToken(user), user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: createToken(user), user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const me = async (req, res) => res.json({ user: req.user });
