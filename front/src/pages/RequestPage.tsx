// src/pages/RequestPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RequestPage.css';

interface Request {
    id: number;
    amount: number;
    description: string;
    status: 'ממתין' | 'מאושר' | 'נדחה';
}

const RequestPage: React.FC = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<Request[]>([
        { id: 1, amount: 150, description: 'בקשה לכרטיסי קולנוע', status: 'ממתין' },
    ]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleRequestSubmit = () => {
        if (!amount || !description) {
            alert("נא למלא את כל השדות!");
            return;
        }

        const newRequest: Request = {
            id: requests.length + 1,
            amount: parseFloat(amount),
            description,
            status: 'ממתין',
        };
        setRequests([...requests, newRequest]);
        setAmount('');
        setDescription('');
    };

    return (
        <div className="request-container">
            <h1>בקשה להוצאה</h1>
            <label>
                סכום:
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
            <label>
                תיאור:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <button onClick={handleRequestSubmit}>שלח בקשה</button>

            <h2>בקשות קודמות</h2>
            <ul>
                {requests.map((request) => (
                    <li key={request.id}>
                        {request.description} - ₪{request.amount} - סטטוס: {request.status}
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/dashboard')}>חזור לדשבורד</button>
        </div>
    );
};

export default RequestPage;
