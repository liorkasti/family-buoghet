import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/users/login', { username, password });
            if (response.data.redirectToSignup) {
                navigate('/signup'); // מעביר לדף ההרשמה אם אין משתמש קיים
            } else {
                setMessage(response.data.message);
                // כאן אפשר לשמור את המידע על ההתחברות, אם צריך
            }
        } catch (error) {
            setMessage('התחברות נכשלה. שם משתמש או סיסמה שגויים.');
        }
    };

    return (
        <div>
            <h2>התחברות</h2>
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
            <p>{message}</p>
        </div>
    );
};

export default LoginPage;
