// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import LoginPage from './pages/LoginPage'; // ייבוא דף הכניסה
// import DashboardPage from './pages/DashboardPage'; // ייבוא דף הדשבורד
// import SignupPage from './pages/SignupPage'; // ייבוא דף ההרשמה
// import AddExpensePage from './pages/AddExpensePage'; // ייבוא דף הוספת ההוצאה
// import RequestPage from './pages/RequestPage'; // ייבוא דף הבקשות
// import FixedExpensesPage from './pages/FixedExpensesPage'; // ייבוא דף ההוצאות הקבועות
// import ExpenseHistoryPage from './pages/ExpenseHistoryPage'; // ייבוא דף היסטוריית ההוצאות
// import UserManagementPage from './pages/UserManagementPage'; // ייבוא דף ניהול המשתמשים

// const App: React.FC = () => {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route path="/" element={<LoginPage />} /> {/* דף הכניסה */}
//                 <Route path="/login" element={<LoginPage />} /> {/* דף הכניסה */}
//                 <Route path="/dashboard" element={<DashboardPage />} /> {/* דף הדשבורד */}
//                 <Route path="/signup" element={<SignupPage />} /> {/* דף ההרשמה */}
//                 <Route path="/add-expense" element={<AddExpensePage />} /> {/* דף הוספת הוצאה */}
//                 <Route path="/request" element={<RequestPage />} /> {/* דף הבקשות */}
//                 <Route path="/fixed-expenses" element={<FixedExpensesPage />} /> {/* דף ההוצאות הקבועות */}
//                 <Route path="/expense-history" element={<ExpenseHistoryPage />} /> {/* דף היסטוריית ההוצאות */}
//                 <Route path="/user-management" element={<UserManagementPage />} /> {/* דף ניהול המשתמשים */}
//             </Routes>
//         </BrowserRouter>
//     );
// };

// export default App;




import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage';
import AddExpensePage from './pages/AddExpensePage';
import RequestPage from './pages/RequestPage';
import FixedExpensesPage from './pages/FixedExpensesPage';
import ExpenseHistoryPage from './pages/ExpenseHistoryPage';
import UserManagementPage from './pages/UserManagementPage';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/add-expense" element={<AddExpensePage />} />
                <Route path="/request" element={<RequestPage />} />
                <Route path="/fixed-expenses" element={<FixedExpensesPage />} />
                <Route path="/expense-history" element={<ExpenseHistoryPage />} />
                <Route path="/user-management" element={<UserManagementPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
