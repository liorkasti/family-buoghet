// src/pages/FixedExpensesPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FixedExpensesPage.css';

interface Expense {
    id: number;
    name: string;
    amount: number;
    nextBillingDate: string;
}

const FixedExpensesPage: React.FC = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState<Expense[]>([
        { id: 1, name: 'שכר דירה', amount: 2500, nextBillingDate: '2024-12-01' },
        { id: 2, name: 'חשמל', amount: 300, nextBillingDate: '2024-11-10' },
    ]);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const addExpense = () => {
        // הוספת הוצאה חדשה
        const newExpense: Expense = {
            id: expenses.length + 1,
            name: 'הוצאה חדשה',
            amount: 0,
            nextBillingDate: new Date().toISOString().slice(0, 10), // תאריך חיוב ברירת מחדל להיום
        };
        setExpenses([...expenses, newExpense]);
        setEditingExpense(newExpense);
    };

    const editExpense = (expense: Expense) => {
        setEditingExpense(expense);
    };

    const saveExpense = () => {
        if (editingExpense) {
            setExpenses(expenses.map(expense => 
                expense.id === editingExpense.id ? editingExpense : expense
            ));
            setEditingExpense(null);
        }
    };

    const deleteExpense = (id: number) => {
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    const isNearBillingDate = (date: string) => {
        const today = new Date();
        const billingDate = new Date(date);
        const diffInDays = (billingDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
        return diffInDays <= 5;
    };

    return (
        <div className="fixed-expenses-container">
            <h1>ניהול הוצאות קבועות</h1>
            <button className="back-button" onClick={() => navigate('/dashboard')}>חזרה לעמוד הראשי</button>
            <button className="home-button" onClick={() => navigate('/')}>חזרה לדף הבית</button>
            
            <table className="expenses-table">
                <thead>
                    <tr>
                        <th>שם ההוצאה</th>
                        <th>סכום</th>
                        <th>תאריך חיוב הבא</th>
                        <th>עריכה</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(expense => (
                        <tr key={expense.id}>
                            <td>{expense.name}</td>
                            <td>{expense.amount} ₪</td>
                            <td>
                                {expense.nextBillingDate} 
                                {isNearBillingDate(expense.nextBillingDate) && <span className="warning-icon">⚠️</span>}
                            </td>
                            <td>
                                <button onClick={() => editExpense(expense)}>ערוך</button>
                                <button onClick={() => deleteExpense(expense.id)}>מחק</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="add-expense-button" onClick={addExpense}>הוספת הוצאה חדשה</button>

            {/* מודל לעריכת הוצאה */}
            {editingExpense && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>עריכת הוצאה</h2>
                        <label>שם ההוצאה:</label>
                        <input 
                            type="text" 
                            value={editingExpense.name} 
                            onChange={(e) => setEditingExpense({ ...editingExpense, name: e.target.value })}
                        />
                        <label>סכום:</label>
                        <input 
                            type="number" 
                            value={editingExpense.amount} 
                            onChange={(e) => setEditingExpense({ ...editingExpense, amount: parseFloat(e.target.value) })}
                        />
                        <label>תאריך חיוב הבא:</label>
                        <input 
                            type="date" 
                            value={editingExpense.nextBillingDate} 
                            onChange={(e) => setEditingExpense({ ...editingExpense, nextBillingDate: e.target.value })}
                        />
                        <button onClick={saveExpense}>שמור</button>
                        <button onClick={() => setEditingExpense(null)}>ביטול</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FixedExpensesPage;
