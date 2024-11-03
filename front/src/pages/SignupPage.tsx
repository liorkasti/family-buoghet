import React, { useState } from 'react';
import axios from 'axios';

const SignupPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/signup', { username, password, role });

            if (response.data.exists) {
                setMessage('המשתמש קיים כבר. בבקשה הזן שם משתמש אחר.');
            } else {
                setMessage('ההרשמה הצליחה!');
            }
        } catch (error) {
            setMessage('שגיאה בהרשמה, נסה שוב.');
        }
    };

    return (
        <div>
            <h2>דף הרשמה</h2>
            <form onSubmit={handleSignup}>
                <label>שם משתמש:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label>סיסמה:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <label>תפקיד:
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">בחר תפקיד</option>
                        <option value="parent">הורה</option>
                        <option value="child">ילד</option>
                    </select>
                </label>
                <br />
                <button type="submit">הירשם</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignupPage;
