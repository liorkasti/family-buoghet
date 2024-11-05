// src/pages/ExpenseHistoryPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ExpenseHistoryPage.css';

interface Expense {
    id: number;
    date: string;
    category: string;
    amount: number;
    description: string;
}

const ExpenseHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState<Expense[]>([
        { id: 1, date: '2024-11-01', category: 'מזון', amount: 200, description: 'קניות בסופר' },
        { id: 2, date: '2024-11-05', category: 'תחבורה', amount: 50, description: 'כרטיס רכבת' },
        // הוצאות נוספות
    ]);

    const handleFilter = () => {
        // פונקציה לסינון הוצאות לפי חודש, שנה, קטגוריה, או טווח תאריכים
    };

    const handleSort = (sortBy: string) => {
        // פונקציה למיון הוצאות לפי סכום, תאריך, או קטגוריה
    };

    return (
        <div className="expense-history-container">
            <h1>היסטוריית הוצאות</h1>
            <button className="back-button" onClick={() => navigate('/dashboard')}>חזרה לדף הבית</button>

            {/* טופס סינון */}
            <div className="filter-sort-container">
                <button onClick={() => handleFilter()}>סינון</button>
                <button onClick={() => handleSort('amount')}>מיון לפי סכום</button>
                <button onClick={() => handleSort('date')}>מיון לפי תאריך</button>
                <button onClick={() => handleSort('category')}>מיון לפי קטגוריה</button>
            </div>

            {/* טבלת הוצאות */}
            <table className="expenses-table">
                <thead>
                    <tr>
                        <th>תאריך</th>
                        <th>קטגוריה</th>
                        <th>סכום</th>
                        <th>תיאור</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(expense => (
                        <tr key={expense.id}>
                            <td>{expense.date}</td>
                            <td>{expense.category}</td>
                            <td>{expense.amount} ₪</td>
                            <td>{expense.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* גרפים לניתוח */}
            <div className="charts-container">
                <div className="category-chart">גרף התפלגות לפי קטגוריות</div>
                <div className="trend-chart">תרשים מגמה</div>
            </div>
        </div>
    );
};

export default ExpenseHistoryPage;
