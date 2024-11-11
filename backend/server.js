const express = require('express');
const http = require('http'); //DODO: configur what is the porpuse
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db'); // ייבוא החיבור למסד הנתונים
require('dotenv').config();

// ייבוא מסלולים
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');

// הגדרות ראשוניות
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5004;

// חיבור למסד הנתונים
connectDB();

// שימוש ב-CORS ו-JSON
app.use(cors());
app.use(express.json());

// הגדרת מסלולים
app.use('/api/users', userRoutes);        // חיבור למסלול המשתמשים
app.use('/api/expenses', expenseRoutes);  // חיבור למסלול ההוצאות

// ניהול Socket.IO
require('./socket/expenseSocket')(io);  // חיבור ל-Socket.IO

// הפעלת השרת
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
