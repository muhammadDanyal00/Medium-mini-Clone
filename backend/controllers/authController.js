import User from "../models/userSchema.js";
import bcrypt from "bcrypt";

// register
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email }); // find the user by email
  } catch (err) {
    return console.log(err);
  }

  if (existingUser) {
    return res.status(400).json({ message: "user already exist" });
  }

  const hashPassword = bcrypt.hashSync(password, 10);

  //if not exist then new user
  const user = new User({
    username,
    email,
    password: hashPassword,
  });

  try {
    await user.save(); // stores in the db
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json({ user });
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      // User not found, avoid revealing email existence for security
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password securely using asynchronous bcrypt.compare
    const isPassMatch = await bcrypt.compare(password, existingUser.password);

    if (!isPassMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Login successful, send a success message (you can customize this)
    res.json({ message: "Login successful", existingUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
