const express = require('express');
const router = express.Router();
const FamilyMember = require('../models/familyMember');  // 引入模型


//获取某月开销记录
router.get('/familyMember', async (req, res) => {
    try {
        // const {regDate} = req.params;

        //update family member for current month expense calculation
        const familyMember = await FamilyMember.aggregate(
            [
                // {$match: {status: "normal"}}, // 筛选条件
                // { $group: { _id: "$payer" } }
                {
                    $project: { 
                        _id: 0, // 隐藏 MongoDB 默认的 `_id` 字段（如果不需要的话）
                        payer: 1, 
                        status: 1 
                    }
                }
            ]
        );
        
        //available family member for current month expense calcualtion
        // const availablePayerList = familyMember.map(member => member._id); // 提取出 payer 值
        

        res.status(200).json({familyMember});
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;