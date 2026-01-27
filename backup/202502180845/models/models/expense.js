const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    payer: {
        type: String,
        required: true,
        },

    price: {
        type: mongoose.Types.Decimal128,
        required: true,
        },

    location: {
        type: String,
        required: true,
        },

    description: {
        type: String,
        required: false,
        },

    regDate: {
        type: String,
        required: true, // 格式如 "2024-11"
        },
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
