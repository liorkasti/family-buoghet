// src/pages/DashboardPage.tsx
import React, { useState } from 'react';

const DashboardPage: React.FC = () => {
    const [budgetBalance, setBudgetBalance] = useState<number>(5000); // יתרת תקציב לדוגמה
    const recentExpenses = [
        { id: 1, description: "מכולת", date: "2024-10-01", amount: 200 },
        { id: 2, description: "דלק", date: "2024-10-02", amount: 150 },
        { id: 3, description: "ביגוד", date: "2024-10-03", amount: 300 },
    ];

    const upcomingExpenses = [
        { id: 1, description: "שכר דירה", dueDate: "2024-10-05", amount: 2500 },
        { id: 2, description: "חשמל", dueDate: "2024-10-10", amount: 400 },
    ];

    return (
        <div className="dashboard-container">
            <h1>דאשבורד ניהול תקציב</h1>

            {/* תצוגת יתרת תקציב */}
            <div className="budget-balance">
                <h2>יתרת תקציב נוכחית</h2>
                <p>{budgetBalance} ש"ח</p>
            </div>

            {/* כרטיס הוצאות אחרונות */}
            <div className="recent-expenses">
                <h3>הוצאות אחרונות</h3>
                <ul>
                    {recentExpenses.map(expense => (
                        <li key={expense.id}>
                            {expense.description} - {expense.date} - {expense.amount} ש"ח
                        </li>
                    ))}
                </ul>
            </div>

            {/* גרף תקציב חודשי (כאן יתווספו גרפים בעתיד) */}
            <div className="budget-graphs">
                <h3>התפלגות התקציב לפי קטגוריות</h3>
                <p>גרף עוגה - בעתיד ניתן להוסיף ספריית גרפים להמחשה</p>
                <h3>מגמת הוצאות לאורך החודש</h3>
                <p>גרף ציר זמן - בעתיד ניתן להוסיף ספריית גרפים להמחשה</p>
            </div>

            {/* התראות */}
            <div className="alerts">
                <h3>התראות תקציב</h3>
                <p>התקציב קרוב לסיום!</p>
            </div>

            {/* הוצאות קבועות קרובות */}
            <div className="upcoming-expenses">
                <h3>הוצאות קבועות קרובות</h3>
                <ul>
                    {upcomingExpenses.map(expense => (
                        <li key={expense.id}>
                            {expense.description} - תאריך יעד: {expense.dueDate} - {expense.amount} ש"ח
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DashboardPage;
