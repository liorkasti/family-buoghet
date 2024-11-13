import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormData {
    username: string;
    password: string;
    role: 'parent' | 'child';
    userId: string;
}

const SignupPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        role: 'parent',
        userId: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = (): boolean => {
        if (!formData.username.trim()) {
            setMessage('נא להזין שם משתמש');
            return false;
        }
        if (!formData.password.trim()) {
            setMessage('נא להזין סיסמה');
            return false;
        }
        if (!formData.userId.trim()) {
            setMessage('נא להזין מזהה משתמש');
            return false;
        }
        return true;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post<{ exists: boolean }>('http://localhost:5004/api/auth/signup', formData);
            if (response.data.exists) {
                setMessage('המשתמש קיים כבר. בבקשה הזן שם משתמש אחר.');
            } else {
                setMessage('ההרשמה הצליחה!');
                navigate('/dashboard');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            setMessage(
                axiosError.response?.status === 404
                    ? 'המשתמש לא קיים. אנא הירשמו.'
                    : 'שגיאה בהרשמה, נסה שוב.'
            );
        }
    };

    return (
        <div className="signup-container">
            <h2 className="text-2xl font-bold mb-6">דף הרשמה</h2>
            <form onSubmit={handleSignup} className="space-y-4">
                <div className="form-group">
                    <input
                        type="text"
                        name="userId"
                        placeholder="מזהה משתמש"
                        value={formData.userId}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="שם משתמש"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="סיסמה"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="role-select"
                    >
                        <option value="parent">הורה</option>
                        <option value="child">ילד</option>
                    </select>
                </div>
                <button type="submit" className="signup-button">
                    הירשם
                </button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default SignupPage;