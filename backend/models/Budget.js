const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    name: {type: String, require: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    start_date: {type: Date, require: true},
    end_date: { type: Date, required: true },
    total_amount: { type: Number, required: true, min: 0 },
    daily_quota: { type: Number, required: true, min: 0 },

    // Thống kê tổng hợp (Bước 3)
    total_spent: { type: Number, default: 0 },
    total_saved: { type: Number, default: 0 },
    total_over_limit: { type: Number, default: 0 },
    
    net_remaining: { type: Number, default: 0 },
})

module.exports = mongoose.model('Budget', budgetSchema);