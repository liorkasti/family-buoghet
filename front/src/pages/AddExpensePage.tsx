import React, { useState } from 'react';
import '../styles/AddExpensePage.css';

const AddExpensePage: React.FC = () => {
    const [amount, setAmount] = useState<number>(10); // התחלת סכום ההוצאה מ-10
    const [category, setCategory] = useState<string>(''); // משתנה לקטגוריה
    const [description, setDescription] = useState<string>(''); // משתנה לתיאור

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // אם המשתמש מקליד סכום שונה, נשמור אותו
        if (value === '') {
            setAmount(10); // אם השדה ריק, נחזיר את הסכום ל-10
        } else {
            const numericValue = parseFloat(value);
            // אם יש מספר תקני, נעדכן את הסכום
            if (!isNaN(numericValue)) {
                setAmount(numericValue);
            }
        }
    };

    const increaseAmount = () => {
        setAmount((prev) => prev + 10); // הגדלה בעשרה
    };

    const decreaseAmount = () => {
        setAmount((prev) => Math.max(prev - 10, 10)); // הקטנה בעשרה (לא פחות מ-10)
    };

    const handleSave = () => {
        // כאן תוכל להוסיף את הקוד לשמירת ההוצאה
        console.log("סכום:", amount, "קטגוריה:", category, "תיאור:", description);
    };

    return (
        <div className="add-expense-container">
            <h1>הוספת הוצאה חדשה</h1>
            <label>סכום ההוצאה:</label>
            <div className="amount-controls">
                <button onClick={decreaseAmount}>-</button>
                <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    min="10"
                />
                <button onClick={increaseAmount}>+</button>
            </div>
            <label>קטגוריה:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">בחר קטגוריה</option>
                <option value="מזון">מזון</option>
                <option value="תחבורה">תחבורה</option>
                <option value="בילויים">בילויים</option>
            </select>
            <label>תיאור הוצאה:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={handleSave}>שמור הוצאה</button>
        </div>
    );
};

export default AddExpensePage;
