// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/AddExpensePage.css';

// const AddExpensePage: React.FC = () => {
//     const navigate = useNavigate();
//     const [title, setTitle] = useState('');
//     const [amount, setAmount] = useState('');
//     const [category, setCategory] = useState('מזון');
//     const [description, setDescription] = useState('');

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();

//         try {
            
//             await axios.post('http://localhost:5004/api/expenses', {
//                 title,
//                 amount: parseFloat(amount),
//                 category,
//                 description,
//                 date: new Date().toISOString(),
//                 isRecurring: false,
//                 //TODO: Modify item name to 'user/id'
//                 userId: localStorage.getItem('id') // יש להחליף במזהה המשתמש בפועל
//             });

//             navigate('/dashboard');
//         } catch (error) {
//             console.error('Error adding expense:', error);
//         }
//     };

//     return (
//         <div className="add-expense-container">
//             <h1>הוספת הוצאה</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="title">כותרת:</label>
//                     <input
//                         type="text"
//                         id="title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="amount">סכום:</label>
//                     <input
//                         type="number"
//                         id="amount"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="category">קטגוריה:</label>
//                     <select
//                         id="category"
//                         value={category}
//                         onChange={(e) => setCategory(e.target.value)}
//                     >
//                         <option value="מזון">מזון</option>
//                         <option value="תחבורה">תחבורה</option>
//                         <option value="בילויים">בילויים</option>
//                         <option value="ביגוד">ביגוד</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label htmlFor="description">תיאור:</label>
//                     <textarea
//                         id="description"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                     />
//                 </div>
//                 <button type="submit">שמור הוצאה</button>
//             </form>
//         </div>
//     );
// };

// export default AddExpensePage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AddExpensePage.css';

const AddExpensePage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('מזון');
    const [description, setDescription] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:5004/api/expenses', {
                title,
                amount: parseFloat(amount),
                category,
                description,
                date: new Date().toISOString(),
                isRecurring: false,
                userId: localStorage.getItem('id') // יש להחליף במזהה המשתמש בפועל
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error adding expense:', error);
        }
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