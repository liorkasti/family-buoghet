// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import './App.css'; // Import the CSS file

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/LoginPage" element={<LoginPage />} />
                <Route path="/DashboardPage" element={<DashboardPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
