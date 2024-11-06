// ייבוא ספריות חיצוניות
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// ייבוא מודלים פנימיים
const Budget = require('./models/Budget');
const Alert = require('./models/Alert');
const User = require('./models/User');  // ייבוא מודל משתמש

// // ייבוא בקרת דשבורד
const dashboardController = require('./controllers/dashboardController');  

// הגדרות ראשוניות
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5004;

// // חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/familyBudgetDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// // שימוש ב-CORS ו-JSON
app.use(cors());
app.use(express.json());

// // מסלול רישום משתמשים חדשים
app.post('/api/users/signup', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'שם המשתמש כבר קיים במערכת' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'משתמש נרשם בהצלחה', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשרת, נסה מאוחר יותר' });
  }
});

// // מסלול התחברות משתמשים קיימים
app.post('/api/users/login', async (req, res) => {
  console.log("----------==hello=================")
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ message: 'התחברות הצליחה', user });
    } else {
      res.status(404).json({ message: 'משתמש לא נמצא', redirectToSignup: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשרת, נסה מאוחר יותר' });
  }
});

// // מסלולים לדשבורד
app.get('/api/dashboard', dashboardController.getDashboardData);
//app.get('/api/dashboard/budget-balance', dashboardController.getBudgetBalance);
//app.get('/api/dashboard/recent-expenses', dashboardController.getRecentExpenses);
//app.get('/api/dashboard/graph-data', dashboardController.getGraphData);
// app.get('/api/dashboard/upcoming-expenses', dashboardController.getUpcomingRecurringExpenses);

// // ניהול Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  // שליחת עדכונים לכל המשתמשים כאשר הוצאה חדשה מתווספת
  socket.on('newExpense', (expense) => {
    io.emit('updateExpenses', expense);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// הפעלת השרת
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
