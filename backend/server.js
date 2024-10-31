const express = require('express');
const connectDB = require('./config/connection'); // חיבור למסד הנתונים
require('dotenv').config();

const userRoutes = require('./routes/userRoutes'); // ייבוא של הנתיבים למשתמשים

const app = express();
app.use(express.json());

// התחברות למסד הנתונים
connectDB();

// הגדרת הנתיבים
app.use('/api/users', userRoutes); // וודא ששורה זו קיימת

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
