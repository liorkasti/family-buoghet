const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    approvedAmount: { type: Number },
    createdAt: { type: Date, default: Date.now },
    approvedAt: { type: Date }
});

module.exports = mongoose.model('Request', requestSchema);
