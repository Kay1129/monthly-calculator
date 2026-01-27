const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');  // 引入模型


// 添加开销记录
router.post('/expense', async (req, res) => {
    try {
        //创建新的记录
        const {payer,price,location, description,regDate} = req.body;
        const expense = new Expense({payer,price,location, description,regDate});
        const savedExpense = await expense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

module.exports = router;