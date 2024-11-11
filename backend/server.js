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
const User = require('./models/User');
const Expense = require('./models/Expense'); // ייבוא מודל ההוצאה

// ייבוא בקרות
const dashboardController = require('./controllers/dashboardController');  

// הגדרות ראשוניות
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5004;

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/familyBudgetDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// שימוש ב-CORS ו-JSON
app.use(cors()); 
app.use(express.json());

//TODO: Move to rout or controller
// מסלול להוספת הוצאה חדשה
app.post('/api/expenses', async (req, res) => {
  //console.log(req.body)
  const {title, amount, category, date, description, isRecurring, userId } = req.body;
  try {
    const newExpense = new Expense({
      title,
      amount,
      category,
      date,
      description,
      isRecurring,
      userId
    });
console.log(newExpense)
    await newExpense.save();

    // שליחת עדכון בזמן אמת דרך Socket.IO
    //io.emit('updateExpenses', newExpense);

    res.status(201).json({ message: 'הוצאה נשמרה בהצלחה', expense: newExpense });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'שגיאה בשמירת ההוצאה', error: error.message });
  }
});

//TODO: Move to rout or controller
// מסלול לרישום משתמש חדש
app.post('/api/users/signup', async (req, res) => {
  const { username, password, role } = req.body;

  // בדיקת קלט תקין – אפשר להוסיף הודעה אם חסר קלט
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
    //TODO: First understend what does save() do
    await newUser.save();
    //TODO: Store user data in cache with token id 
    await setItem(newUser, 'user')


    res.status(201).json({ exists: false });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


// ניהול Socket.IO
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