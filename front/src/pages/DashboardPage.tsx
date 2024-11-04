import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardPage.css'; // נוודא שיש תיקיה עם סגנונות

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const goToAddExpense = () => {
        navigate('/add-expense'); // ניווט לדף הוספת הוצאה
    };

    return (
        <div className="dashboard-container">
            <header className="header">
                <h1>דשבורד תקציב משפחתי</h1>
            </header>

            <section className="budget-section">
                <h2>יתרת תקציב נוכחית</h2>
                <div className="budget-balance">₪5,000</div>
            </section>

            <section className="recent-expenses-section">
                <h2>הוצאות אחרונות</h2>
                <ul className="expense-list">
                    <li>מזון - ₪100 - 01/11/2024</li>
                    <li>תחבורה - ₪50 - 02/11/2024</li>
                    <li>בילויים - ₪200 - 03/11/2024</li>
                </ul>
            </section>

            <section className="charts-section">
                <div className="pie-chart">
                    <h2>התפלגות תקציב לפי קטגוריות</h2>
                    {/* גרף עוגה */}
                </div>
                <div className="line-chart">
                    <h2>מגמת הוצאות חודשית</h2>
                    {/* גרף ציר זמן */}
                </div>
            </section>

            <section className="alerts-section">
                <h2>התראות</h2>
                <div className="alert">⚠️ התקציב קרוב לסיום!</div>
            </section>

            <section className="upcoming-expenses-section">
                <h2>הוצאות קבועות קרובות</h2>
                <ul className="upcoming-expenses-list">
                    <li>חשמל - ₪400 - 05/11/2024</li>
                    <li>מים - ₪150 - 10/11/2024</li>
                    <li>שכר דירה - ₪3,000 - 01/12/2024</li>
                </ul>
            </section>

            <button className="add-expense-floating-button" onClick={goToAddExpense}>
                +
            </button>
        </div>
    );
};

export default DashboardPage;
