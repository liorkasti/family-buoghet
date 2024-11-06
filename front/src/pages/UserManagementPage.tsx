import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserManagementPage.css';

interface User {
    id: number;
    name: string;
    role: string;
    budget: number;
}

const UserManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: 'ילד א', role: 'ילד', budget: 500 },
        { id: 2, name: 'ילד ב', role: 'ילד', budget: 600 },
    ]);
    const [isFormVisible, setFormVisible] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const role = (form.elements.namedItem('role') as HTMLInputElement).value;
        const budget = parseFloat((form.elements.namedItem('budget') as HTMLInputElement).value);

        if (currentUser) {
            setUsers(users.map(user => (user.id === currentUser.id ? { ...user, name, role, budget } : user)));
        } else {
            const newUser: User = {
                id: users.length + 1,
                name,
                role,
                budget,
            };
            setUsers([...users, newUser]);
        }

        setFormVisible(false);
        setCurrentUser(null);
    };

    const editUser = (user: User) => {
        setCurrentUser(user);
        setFormVisible(true);
    };

    const deleteUser = (id: number) => {
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div className="user-management-container">
            <h1>ניהול משתמשים</h1>
            <button className="back-button" onClick={() => navigate('/dashboard')}>חזרה לדף הבית</button>

            {isFormVisible && (
                <form onSubmit={handleFormSubmit} className="user-form">
                    <h2>{currentUser ? 'עריכת משתמש' : 'הוספת משתמש חדש'}</h2>
                    <label>
                        שם משתמש:
                        <input type="text" name="name" defaultValue={currentUser ? currentUser.name : ''} required />
                    </label>
                    <label>
                        תפקיד:
                        <input type="text" name="role" defaultValue={currentUser ? currentUser.role : ''} required />
                    </label>
                    <label>
                        תקציב:
                        <input type="number" name="budget" defaultValue={currentUser ? currentUser.budget.toString() : ''} required />
                    </label>
                    <button type="submit">{currentUser ? 'שמור שינויים' : 'הוסף משתמש'}</button>
                    <button type="button" onClick={() => { setFormVisible(false); setCurrentUser(null); }}>ביטול</button>
                </form>
            )}

            <table className="users-table">
                <thead>
                    <tr>
                        <th>שם המשתמש</th>
                        <th>תפקיד</th>
                        <th>תקציב</th>
                        <th>ניהול</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>{user.budget} ₪</td>
                            <td>
                                <button onClick={() => editUser(user)}>ערוך</button>
                                <button onClick={() => deleteUser(user.id)}>מחק</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="add-user-button" onClick={() => { setFormVisible(true); setCurrentUser(null); }}>הוספת משתמש חדש</button>
        </div>
    );
};

export default UserManagementPage;
