// // routes/expenseRoutes.js
// const express = require('express');
// const router = express.Router();
// const expenseController = require('../controllers/expenseController');
// const { requireParent } = require('../middleware/auth');

// // נתיבי הוצאות רגילות
// router.post('/', expenseController.addExpense);
// router.get('/', expenseController.getExpenses);
// router.get('/summary', expenseController.getExpenseSummary);
// router.put('/:id', expenseController.updateExpense);
// router.delete('/:id', expenseController.deleteExpense);

// module.exports = router;