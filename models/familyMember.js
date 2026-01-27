const mongoose = require('mongoose');

// 定义 FamilyMember Schema
const expenseSchema = new mongoose.Schema({
    payer: {
        type: String, 
        required: true 
    },
    status: 
    { 
        type: String, 
        required: true 
    }
});

// 创建并导出模型
const FamilyMember = mongoose.model('FamilyMember', expenseSchema);
module.exports = FamilyMember;
