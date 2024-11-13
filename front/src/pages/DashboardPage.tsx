import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

interface UserData {
    username: string;
    // Add other user data properties as needed
}

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [isOptionsVisible, setOptionsVisible] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:5004/api/dashboard');
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5004/api/user');
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchDashboardData();
        fetchUserData();
    }, []);

    const handleLogout = () => {
        // Perform logout logic, such as clearing tokens or session data
        navigate('/login');
    };

    const toggleOptions = () => setOptionsVisible(!isOptionsVisible);

    return (
        <div className="dashboard-container">
            <h1>שלום {userData?.username ? `, ${userData.username}` : ''}</h1>

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

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/DashboardPage.css';

// interface DashboardData {
//     totalBudget: number;
//     recentExpenses: {
//         title: string;
//         amount: number;
//         category: string;
//         date: string;
//     }[];
//     upcomingExpenses: {
//         title: string;
//         amount: number;
//         category: string;
//         date: string;
//     }[];
// }

// interface UserData {
//     username: string;
// }

// const DashboardPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [isOptionsVisible, setOptionsVisible] = useState(false);
//     const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//     const [userData, setUserData] = useState<UserData | null>(null);

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5004/api/dashboard');
//                 setDashboardData(response.data);
//             } catch (error) {
//                 console.error("Error fetching dashboard data:", error);
//             }
//         };

//         const fetchUserData = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5004/api/user');
//                 setUserData(response.data);
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         };

//         fetchDashboardData();
//         fetchUserData();
//     }, []);

//     const handleLogout = () => {
//         // הוצא את הפעולה של יציאה מהמערכת, כגון מחיקת אסימוני התחברות או נתוני המושב
//         navigate('/login');
//     };

//     const toggleOptions = () => {
//         setOptionsVisible(!isOptionsVisible);
//     };

//     const handleOptionClick = (option: string) => {
//         navigate(`/${option}`);
//     };

//     return (
//         <div className="dashboard-container">
//             <h1>שלום {userData?.username ? `, ${userData.username}` : ''}</h1>

//             <button onClick={handleLogout}>יציאה</button>

//             <button
//                 className="add-expense-floating-button"
//                 onClick={toggleOptions}
//                 aria-label="תפריט אפשרויות"
//             >
//                 +
//             </button>

//             {isOptionsVisible && (
//                 <div className="options-menu">
//                     <button onClick={() => handleOptionClick('add-expense')}>
//                         🧾 הוספת הוצאה
//                     </button>
//                     <button onClick={() => handleOptionClick('request')}>
//                         📝 בקשה חדשה
//                     </button>
//                     <button onClick={() => handleOptionClick('fixed-expenses')}>
//                         📅 הוצאות קבועות
//                     </button>
//                     <button onClick={() => handleOptionClick('expense-history')}>
//                         📊 היסטוריית הוצאות
//                     </button>
//                     <button onClick={() => handleOptionClick('user-management')}>
//                         👥 ניהול משתמשים
//                     </button>
//                 </div>
//             )}

//             <section className="budget-section">
//                 <h2>יתרת תקציב נוכחית</h2>
//                 <div className="budget-balance">₪{dashboardData?.totalBudget}</div>
//             </section>

//             <section className="recent-expenses-section">
//                 <h2>הוצאות אחרונות</h2>
//                 <ul className="expense-list">
//                     {dashboardData?.recentExpenses.map((expense, index) => (
//                         <li key={index}>{expense.category} - ₪{expense.amount} - {new Date(expense.date).toLocaleDateString()}</li>
//                     ))}
//                 </ul>
//             </section>

//             <section className="upcoming-expenses-section">
//                 <h2>הוצאות קבועות קרובות</h2>
//                 <ul className="upcoming-expenses-list">
//                     {dashboardData?.upcomingExpenses.map((expense, index) => (
//                         <li key={index}>{expense.category} - ₪{expense.amount} - {new Date(expense.date).toLocaleDateString()}</li>
//                     ))}
//                 </ul>
//             </section>
//         </div>
//     );
// };

// export default DashboardPage;