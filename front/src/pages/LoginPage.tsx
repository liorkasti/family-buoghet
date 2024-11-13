import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

interface FormData {
    username: string;
    password: string;
    role: 'parent' | 'child';
    userId: string;
}

interface LoginResponse {
    token: string;
    username: string;
    userId: string;
}

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        role: 'parent',
        userId: ''
    });
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
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

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post<LoginResponse>(
                'http://localhost:5004/api/users/login',
                formData
            );
            const { token, username, userId } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userRole', formData.role);

            setMessage('התחברות הצליחה!');
            navigate('/dashboard');
        } catch (error) {
            const axiosError = error as AxiosError;
            setMessage(
                axiosError.response?.status === 404
                    ? 'המשתמש לא קיים. אנא הירשמו.'
                    : 'התחברות נכשלה. אנא בדקו את הפרטים.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1 className="text-2xl font-bold mb-6">כניסה למערכת ניהול תקציב</h1>

            <form onSubmit={handleLogin} className="space-y-4">
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

                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? 'מתחבר...' : 'התחבר'}
                </button>

                <div className="flex justify-between items-center mt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="secondary-button"
                    >
                        הרשמה
                    </button>
                    <a href="/reset-password" className="forgot-password">
                        שכחתי סיסמה
                    </a>
                </div>

                {message && (
                    <div className={`message ${message.includes('הצליחה') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default LoginPage;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';

// interface FormData {
//     username: string;
//     password: string;
//     role: 'parent' | 'child';
//     userId: string;
// }

// interface LoginResponse {
//     token: string;
//     username: string;
//     userId: string;
// }

// const LoginPage: React.FC = () => {
//     const [formData, setFormData] = useState<FormData>({
//         username: '',
//         password: '',
//         role: 'parent',
//         userId: ''
//     });
//     const [message, setMessage] = useState<string>('');
//     const [loading, setLoading] = useState<boolean>(false);
//     const navigate = useNavigate();

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const validateForm = (): boolean => {
//         if (!formData.username.trim()) {
//             setMessage('נא להזין דוא"ל');
//             return false;
//         }
//         if (!formData.password.trim()) {
//             setMessage('נא להזין סיסמה');
//             return false;
//         }
//         if (!formData.userId.trim()) {
//             setMessage('נא להזין מזהה משתמש');
//             return false;
//         }
//         return true;
//     };

//     const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         setLoading(true);
//         try {
//             const response = await axios.post<LoginResponse>(
//                 'http://localhost:5004/api/users/login',
//                 formData
//             );
//             const { token, username, userId } = response.data;

//             localStorage.setItem('token', token);
//             localStorage.setItem('username', username);
//             localStorage.setItem('userId', userId);
//             localStorage.setItem('userRole', formData.role);

//             setMessage('התחברות הצליחה!');
//             navigate('/dashboard');
//         } catch (error) {
//             const axiosError = error as AxiosError;
//             setMessage(
//                 axiosError.response?.status === 404
//                     ? 'המשתמש לא קיים. אנא הירשמו.'
//                     : 'התחברות נכשלה. אנא בדקו את הפרטים.'
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="login-container">
//             {/* ... */}
//         </div>
//     );
// };

// export default LoginPage;