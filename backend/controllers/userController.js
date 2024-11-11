// const User = require('../models/User');
// const bcrypt = require('bcrypt');

// exports.registerUser = async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const user = new User({
//       username: req.body.username,
//       password: hashedPassword,
//       role: req.body.role,
//     });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    console.error('Missing fields in signup request');
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.warn('User already exists:', username);
      return res.status(200).json({ exists: true });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ exists: false });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};
