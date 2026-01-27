const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');  // 引入模型


// 获取某人某月开销记录列表
router.get('/expense/:regDate/:payer', async (req, res) => {
    try {
        const {regDate,payer} = req.params;

        // 验证参数是否完整
        if (!payer || !regDate) {
            return res.status(400).json({
                error: 'Both payer and regDate are required.'
            });
        }


        // 验证 data 是否存在于数据库中
        const dataExists = await Expense.findOne({
            payer: payer, regDate: regDate
        });
        if (!dataExists) {
            // return res.status(404).json({
            //     error: `data does not exist.`
            // });
            return res.status(404).json({
                regDate,
                totalPrice: "$0.00",
                personalDetaiListResult: [
                    {
                        payer: payer,
                        location: 'N/A',
                        price: "$0.00",
                        description: 'N/A',
                        regDate: regDate,
                        _id: '',
                    },
                ],
            });
        }

        // 使用聚合计算总金额
        const totalPriceResult = await Expense.aggregate(
            [
                {$match: {payer: payer, regDate: regDate}}, // 筛选条件
                {$group: {_id: null,totalPrice: {$sum: '$price'}}} // 聚合计算
            ]
        );
        // 如果有结果，返回总和；否则返回 0
        const totalPrice = totalPriceResult.length > 0 && totalPriceResult[0].totalPrice ? "$" + totalPriceResult[0].totalPrice.toString() : 0;

        // 查询匹配记录，返回需要的字段
        const originalPersonalDetaiListResult = await Expense.find(
            {payer: payer,regDate: regDate}, 
            {payer: 1,location: 1, price: 1,description: 1, regDate: 1,_id: 1} // 返回需要的字段，排除 _id
        );


        const personalDetaiListResult = originalPersonalDetaiListResult.map((item) => ({
            ...item._doc, // 获取原始数据对象
            price: "$" + item.price.toString(), // 将 `price` 转换为字符串
        }));

        res.status(200).json({regDate,totalPrice,personalDetaiListResult});
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;