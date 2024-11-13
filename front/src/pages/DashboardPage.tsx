import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // כאן נדרש import של axios
import '../styles/DashboardPage.css';

interface Expense {
    title: string;
    amount: number;
    category: string;
    date: string;
}

interface DashboardData {
    recentExpenses: Expense[];
    totalBudget: number;
    upcomingExpenses: Expense[];
}

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [isOptionsVisible, setOptionsVisible] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:5004/api/dashboard');
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
    
        fetchDashboardData(); // הפונקציה צריכה להתבצע כאן
    }, []); // הפונקציה תתבצע רק פעם אחת כאשר הקומפוננטה תיטען
    
    const username = localStorage.getItem('username');  // בהנחה שהמשתמש נשמר ב-localStorage

    const handleLogout = () => {
        localStorage.removeItem('token'); // הסרת ה-token
        localStorage.removeItem('username'); // הסרת שם המשתמש
        navigate('/login'); // חזרה לדף הכניסה
    };

    const toggleOptions = () => setOptionsVisible(!isOptionsVisible);

    return (
        <div className="dashboard-container">
            <h1>שלום {username ? `, ${username}` : ''}</h1>

            <button onClick={handleLogout}>יציאה</button>

            <button 
                className="add-expense-floating-button" 
                onClick={toggleOptions}
                aria-label="תפריט אפשרויות"
            >
                +
            </button>

            {isOptionsVisible && (
                <div className="options-menu">
                    <button onClick={() => navigate('/add-expense')}>
                        🧾 הוספת הוצאה
                    </button>
                    <button onClick={() => navigate('/request')}>
                        📝 בקשה חדשה
                    </button>
                    <button onClick={() => navigate('/fixed-expenses')}>
                        📅 הוצאות קבועות
                    </button>
                    <button onClick={() => navigate('/expense-history')}>
                        📊 היסטוריית הוצאות
                    </button>
                    <button onClick={() => navigate('/user-management')}>
                        👥 ניהול משתמשים
                    </button>
                </div>
            )}

            <section className="budget-section">
                <h2>יתרת תקציב נוכחית</h2>
                <div className="budget-balance">₪{dashboardData?.totalBudget}</div>
            </section>

            <section className="recent-expenses-section">
                <h2>הוצאות אחרונות</h2>
                <ul className="expense-list">
                    {dashboardData?.recentExpenses.map((expense, index) => (
                        <li key={index}>{expense.category} - ₪{expense.amount} - {new Date(expense.date).toLocaleDateString()}</li>
                    ))}
                </ul>
            </section>

            <section className="upcoming-expenses-section">
                <h2>הוצאות קבועות קרובות</h2>
                <ul className="upcoming-expenses-list">
                    {dashboardData?.upcomingExpenses.map((expense, index) => (
                        <li key={index}>{expense.category} - ₪{expense.amount} - {new Date(expense.date).toLocaleDateString()}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default DashboardPage;



