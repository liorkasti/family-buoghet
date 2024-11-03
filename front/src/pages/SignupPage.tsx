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
            const response = await axios.post('/api/users/signup', {
                username,
                password,
                role,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('שגיאה בהרשמה, נסה שוב.');
        }
    };

    return (
        <div>
            <h2>דף הרשמה</h2>
            <form onSubmit={handleSignup}>
                <label>
                    שם משתמש:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    סיסמה:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    תפקיד:
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">הירשם</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignupPage;

// הוספת export {} כדי לוודא שהקובץ נחשב מודול
export { };
