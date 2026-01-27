const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');  // 引入模型

const averagePrice = 0;

//获取某人某月开销记录总和
router.get('/expense/monthSummary/:regDate/', async (req, res) => {
    try {
        const {regDate} = req.params;

        // 验证参数是否完整
        if (!regDate) {
            return res.status(400).json({
                error: 'regDate is required.'
            });
        }

        // 解析年份和月份
        const [year, monthName] = regDate.split("-");
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const allPayers = ["Fanyi", "Christy", "Kai", "Yining & Tang"];
        const monthIndex = monthNames.indexOf(monthName);

        if (monthIndex === -1) {
            return res.status(400).json({ error: "Invalid regDate format" });
        }

        const previousMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
        const previousYear = monthIndex === 0 ? year - 1 : year;
        const previousRegDate = `${previousYear}-${monthNames[previousMonthIndex]}`;


        // get last monthly total expense
        const lastTotalPriceResult = await Expense.aggregate(
            [
                {$match: {regDate: previousRegDate}}, // 筛选条件
                {$group: {_id: null,totalPrice: {$sum: '$price'}}} // 聚合计算
            ]
        );
        // total price in last month 如果有结果，返回总和；否则返回 N/A
        const lastTotalPrice = lastTotalPriceResult.length > 0 && lastTotalPriceResult[0].totalPrice ? '$' + lastTotalPriceResult[0].totalPrice.toString() : "N/A";

        // 验证 data 是否存在于数据库中
        const dataExists = await Expense.findOne({
            regDate: regDate
        });
        if (!dataExists) {
            // return default data
            return res.status(404).json({
                regDate,
                totalPrice: 0.00,
                averagePrice: 0.00,
                monthDiff: "N/A",
                lastTotalPrice: lastTotalPrice,
                totalCount: 0,
                monthlyRecentDetaiListResult: [
                    {
                        payer: 'N/A',
                        location: 'N/A',
                        price: "$0.00",
                        description: 'N/A',
                        regDate: regDate,
                        _id: '',
                    },
                ],
                sortedExpenseSummary:[
                    {
                        name: "Fanyi",
                        paid: 0.00,
                        toBePaid:0.00
                    },
                    {
                        name: "Christy",
                        paid: 0.00,
                        toBePaid:0.00
                    },
                    {
                        name: "Kai",
                        paid: 0.00,
                        toBePaid:0.00
                    },
                    {
                        name: "Yining & Tang",
                        paid: 0.00,
                        toBePaid:0.00
                    },
                ],                
            });
        }
 
        // monthly total expense
        const totalPriceResult = await Expense.aggregate(
            [
                {$match: {regDate: regDate}}, // 筛选条件
                {$group: {_id: null,totalPrice: {$sum: '$price'}}} // 聚合计算
            ]
        );
        // total price in current month 如果有结果，返回总和；否则返回 0
        const totalPrice = totalPriceResult.length > 0 && totalPriceResult[0].totalPrice ? totalPriceResult[0].totalPrice.toString() : 0;
        const averagePrice = parseFloat(totalPrice / 5).toFixed(2);

        // difference percentage status between total price in current month and last month
        let diffStatus;
        let diffSymbol = ""
        if(totalPrice != 0 && lastTotalPrice != "N/A"){
            const diff = ((totalPrice/lastTotalPriceResult[0].totalPrice - 1) * 100).toFixed(2)
            if(diff < 0){
                diffStatus = "positive"
            }
            else{
                diffStatus = "negative"
                diffSymbol = "+"
            }
            
        }
        
        // difference percentage between total price in current month and last month
        const monthDiff = totalPrice != 0 && lastTotalPrice != "N/A" ? diffSymbol + ((totalPrice/lastTotalPriceResult[0].totalPrice - 1) * 100).toFixed(2) + "%" : "N/A"

        // total expense price paid by per person
        const totalExpenseByPayer = await Expense.aggregate([
            {
              $match: {
                regDate: regDate // 筛选当前的 regDate，例如 "2024-11"
              }
            },
            {
              $group: {
                _id: "$payer", // 按照 `payer` 分组
                totalExpense: { $sum: { $toDouble: "$price" } } // 计算每个人的总支出
              }
            },
        ]);

        // if any payer doesn't have uploaded expense, set the uploaded expense as $0.00
        const completeExpenseByPayer = allPayers.map((payer) => {
            const foundPayer = totalExpenseByPayer.find((item) => item._id === payer);
            return {
              _id: payer,
              totalExpense: foundPayer ? foundPayer.totalExpense : 0,
            };
        });

        // expense summary for 4 different payers
        const expenseSummary = completeExpenseByPayer.map(payer => {
            if (payer._id === "Yining & Tang") {
                // 计算其他 3 个人的负 difference 总和
                const negativeDifferenceSum = completeExpenseByPayer
                .filter(otherPayer => otherPayer._id !== "Yining & Tang")
                .reduce((sum, otherPayer) => {
                    const otherDifference = averagePrice - otherPayer.totalExpense;
                    return sum + (otherDifference < 0 ? otherDifference : 0);
                }, 0);
            
                return {
                name: payer._id,
                paid: parseFloat(payer.totalExpense).toFixed(2),
                toBePaid: parseFloat(negativeDifferenceSum).toFixed(2) // 特殊逻辑
                };
            } else {
                // 常规逻辑
                return {
                name: payer._id,
                paid: parseFloat(payer.totalExpense).toFixed(2),
                toBePaid: parseFloat(averagePrice - payer.totalExpense).toFixed(2)
                };
            }
        });



        // set expenseSummary in a fixed order
        const sortedExpenseSummary = expenseSummary.sort((a, b) => {
            const indexA = allPayers.indexOf(a.name);
            const indexB = allPayers.indexOf(b.name);
            return indexA - indexB;
        });

        // tatal expense counts
        const totalCountByRegDate = await Expense.aggregate([
        {
            $match: {
            regDate: regDate // 替换为当前的 regDate，例如 "2024-11"
            }
        },
        {
            $count: "totalCount"
        }
        ]);

        // seperate totalCount from the original object
        const totalCount = totalCountByRegDate[0].totalCount


        // Latest 5 record in the current month 查询匹配记录，返回需要的字段
        const originalMonthlyRecentDetaiListResult = await Expense.find(
            {regDate: regDate}, 
            {payer: 1,location: 1, price: 1,description: 1, regDate: 1,_id: 1} // 返回需要的字段，排除 _id
        ).sort({ _id: -1 }) // 按照 `_id` 降序排列，最新的排在前面
        .limit(5); // 获取最新的 5 条数据

        // 对结果中的 `price` 字段执行 `toString` 转换. format price as string
        const monthlyRecentDetaiListResult = originalMonthlyRecentDetaiListResult.map((item) => ({
            ...item._doc, // 获取原始数据对象
            price: "$" + item.price.toString(), // 将 `price` 转换为字符串
        }));
        
        // return paras
        res.status(200).json({regDate, totalExpenseByPayer ,totalCount, monthlyRecentDetaiListResult, totalPrice, averagePrice, lastTotalPrice, monthDiff, diffStatus, sortedExpenseSummary});
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;