// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: String,
});

const User = mongoose.model('User', UserSchema);

app.use(cors());
app.use(express.json());

app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ message: 'התחברות הצליחה', user });
    } else {
      res.status(404).json({ message: 'משתמש לא נמצא', redirectToSignup: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשרת, נסה מאוחר יותר' });
  }
});

app.post('/api/users/signup', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'שם המשתמש כבר קיים במערכת' });
    }

    const newUser = new User({ username, password, role });
    await newUser.save();
    res.status(201).json({ message: 'משתמש נרשם בהצלחה', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשרת, נסה מאוחר יותר' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
