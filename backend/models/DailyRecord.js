const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        require: true,
        validate: {
            validator: (v) => v !== 0,
            message: props => `${props.value} must not be zero`
        }
    },

    description: { type: String, default: '' },
    category: { type: String, default: 'Uncategorized' },
    created_at: { type: Date, default: Date.now }
})


const dailyRecordSchema = new mongoose.Schema({
    budget_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Budget', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true,
        // Đảm bảo chỉ có ngày (không có giờ)
        set: (v) => new Date(v.getFullYear(), v.getMonth(), v.getDate())
    },

    quota: { type: Number, required: true }, 
    spent: { type: Number, default: 0 }, // Tổng chi tiêu (amount < 0)
    added_money: { type: Number, default: 0 }, // Tổng tiền thêm (amount > 0)
    remaining: { type: Number, default: 0 }, // remaining = quota + added_money - spent
    
    transactions: [transactionSchema] // Nhúng danh sách giao dịch
})

// Index để đảm bảo mỗi Budget chỉ có một DailyRecord cho mỗi ngày
dailyRecordSchema.index({ budget_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyRecord', dailyRecordSchema);