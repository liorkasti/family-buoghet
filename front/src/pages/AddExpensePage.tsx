import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddExpensePage.css';

const AddExpensePage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('מזון');
    const [description, setDescription] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('הוצאה נוספת:', { title, amount, category, description });

        navigate('/dashboard');
    };

    return (
        <div className="add-expense-container">
            <h1>הוספת הוצאה</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">כותרת:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount">סכום:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category">קטגוריה:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="מזון">מזון</option>
                        <option value="תחבורה">תחבורה</option>
                        <option value="בילויים">בילויים</option>
                        <option value="ביגוד">ביגוד</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="description">תיאור:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit">שמור הוצאה</button>
            </form>
        </div>
    );
};

export default AddExpensePage;
