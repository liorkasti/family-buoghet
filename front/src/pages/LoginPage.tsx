// src/pages/LoginPage.tsx
import React, { useState } from 'react';
// import './LoginPage.css';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('child'); // ברירת מחדל כ"ילד"
    const [error, setError] = useState<string>('');

    const handleLogin = () => {
        if (username === 'test' && password === '1234') {
            console.log('התחברות הצליחה');
            // העברת המשתמש לדף הבית או שמירת מצב התחברות
        } else {
            setError('שם משתמש או סיסמה אינם נכונים');
        }
    };

    return (
        <div className="login-container">
            <h1>כניסה למערכת ניהול תקציב</h1>
            <form>
                <label>
                    שם משתמש:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    סיסמה:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <label>
                    זיהוי תפקיד:
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="parent">הורה</option>
                        <option value="child">ילד</option>
                    </select>
                </label>
                <button type="button" onClick={handleLogin}>כניסה</button>
                {error && <p className="error">{error}</p>}
                <p>
                    <a href="/forgot-password">שכחת סיסמה?</a>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
