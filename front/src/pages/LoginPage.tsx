import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/users/login', { username, password });
            setMessage(response.data.message || 'התחברות הצליחה!');
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                setMessage('המשתמש לא קיים. אנא הרשמו.');
            } else {
                setMessage('התחברות נכשלה. שם משתמש או סיסמה שגויים.');
            }
        }
    };

    const goToSignup = () => {
        navigate('/signup');
    };

    return (
        <div className="login-container">
            <h1>התחברות</h1>
            <input
                type="text"
                placeholder="שם משתמש"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>התחבר</button>
            <button onClick={goToSignup}>הרשמה</button>
            <p className="error">{message}</p>
        </div>
    );
};

export default LoginPage;
