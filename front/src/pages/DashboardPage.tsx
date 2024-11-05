import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardPage.css';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [isOptionsVisible, setOptionsVisible] = useState(false); // מצב לתצוגת האפשרויות

    const toggleOptions = () => {
        console.log(isOptionsVisible); // בדיקה האם הערך מתחלף
        setOptionsVisible(!isOptionsVisible);
    };

    const goToFixedExpenses = () => {
        navigate('/fixed-expenses'); // מעבר לדף הוצאות קבועות
    };

    return (
        <div className="dashboard-container">
            <h1>ברוך הבא לדף הבית</h1>

            {/* כפתור להוספת הוצאות */}
            <button className="add-expense-floating-button" onClick={toggleOptions}>
                +
            </button>

            {/* תפריט אפשרויות */}
            {isOptionsVisible && (
                <div className="options-menu">
                    <button onClick={() => navigate('/add-expense')}>הוספת הוצאה</button>
                    <button onClick={() => navigate('/request')}>בקשה חדשה</button>
                    <button onClick={goToFixedExpenses}>הוצאות קבועות</button>
                    <button onClick={() => navigate('/expense-history')}>היסטוריית הוצאות</button>
                    <button onClick={() => navigate('/user-management')}>ניהול משתמשים</button>
                </div>
            )}

            {/* תוכן נוסף */}
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
        </div>
    );
};

export default DashboardPage;
