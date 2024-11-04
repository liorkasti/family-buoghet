import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage';
import AddExpensePage from './pages/AddExpensePage'; // הוספת הייבוא לדף הוספת ההוצאה

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/add-expense" element={<AddExpensePage />} /> {/* הוספת הנתיב לדף הוספת הוצאה */}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
