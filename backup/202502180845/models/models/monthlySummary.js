const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    RegDate: {
        type: String,
        required: true, // 格式如 "2024-11"
        },

    ExpenseTotal: {
        type: Number,
        required: true,
        }
});

const MonthlySummary = mongoose.model('MonthlySummary', expenseSchema);
module.exports = MonthlySummary;
