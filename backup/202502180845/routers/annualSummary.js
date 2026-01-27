const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');  // 引入模型


//获取某月开销记录
router.get('/expense/annualSummary/:year/', async (req, res) => {
    try {
        const {year} = req.params;

        // 定义月份名称
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const locationNames = [
            "Taiping", "Smart", "Countdown", "Costco", "Paknsave", "Sales Warehouse", "Others"
        ]

        // 构造该年份每个月的 regDate 数组
        const regDates = monthNames.map(month => `${year}-${month}`);

        // 验证参数是否完整
        if (!year) {
            return res.status(400).json({
                error: 'Both payer and regDate are required.'
            });
        }


        // 使用 MongoDB 聚合查询
        const monthlyTotalExpenses = await Expense.aggregate([
            {
            $match: {
                regDate: { $in: regDates }, // 筛选当前年份的所有 regDate
            },
            },
            {
            $group: {
                _id: "$regDate", // 按照 regDate 分组
                totalExpense: { $sum: { $toDouble: "$price" } }, // 计算总支出
            },
            },
        ]);


        // 如果未找到任何数据，返回 404 响应
        if (monthlyTotalExpenses.length === 0) {
            return res.status(404).json({
                year,
                formatMonthlyExpenseResult: [],
                formatLocationDataResult: [],
                annualTotalExpense: 0,
                originalMonthlyLocationExpenseResult: [],
                highestExpenseLocation: { location: 'N/A', totalExpense: 0 },
                highestMonthlyExpense: { regDate: 'N/A', totalExpense: 0 },
                lowestMonthlyExpense: { regDate: 'N/A', totalExpense: 0 },
                message: 'No data found for the specified year.'
            });
        }

        // console.log(totalExpenses)


        // 初始化结果对象，将每个月的总支出设置为 0
        const monthlyExpenseResult = regDates.map(regDate => ({
            regDate,
            totalExpense: 0,
        }));

        // 将查询结果填充到结果对象中
        monthlyTotalExpenses.forEach(expense => {
            const index = monthlyExpenseResult.findIndex(item => item.regDate === expense._id);
            if (index !== -1) {
                monthlyExpenseResult[index].totalExpense = parseFloat(expense.totalExpense.toFixed(2));
            }
        });

        const formatMonthlyExpenseResult = monthlyExpenseResult.map(item => {
            const formattedRegDate = item.regDate.slice(5, 8);
            return{
                date: formattedRegDate,
                Expense: parseFloat(item.totalExpense).toFixed(2)
            }
        });

        // 找到 totalExpense 最高的 location
        const highestMonthlyExpense = monthlyExpenseResult.reduce((max, month) => {
            const formattedRegDate = month.regDate.slice(5);
            return month.totalExpense > max.totalExpense ? { ...month, regDate: formattedRegDate } : max;
        }, { regDate: '', totalExpense: 0 }); // 初始值


        // 找到 totalExpense 最低的 location
        const lowestMonthlyExpense = monthlyExpenseResult
        .filter(month => month.totalExpense > 0) // 跳过支出为 0 的月份
        .reduce((min, month) => {
            const formattedRegDate = month.regDate.slice(5);
            return month.totalExpense < min.totalExpense
                ? { ...month, regDate: formattedRegDate }
                : min;
        }, { regDate: '', totalExpense: Infinity });

        // 查询每个 location 的总支出
        const locationExpenses = await Expense.aggregate([
            {
            $match: {
                regDate: { $in: regDates }, // 筛选当前年份的所有 regDate
            },
            },
            {
            $group: {
                _id: { location: "$location", regDate: "$regDate" },
                totalExpense: { $sum: { $toDouble: "$price" } }, // 计算 location 的总支出
            },
            },
        ]);
    
        // 初始化结果对象，确保每个 location 都有数据
        const originalLocationDataResult = locationNames.map((location) => ({
            location,
            highestExpense: 0,
            lowestExpense: 0,
            averageExpense: 0,
            totalExpense: 0,
            percentage: 0, // 比重，稍后计算
            monthlyExpenses: Array(12).fill(0), // 初始化 12 个月的支出为 0
        }));
    
        // 填充已有的 location 数据
        locationExpenses.forEach((expense) => {
            const locationIndex = originalLocationDataResult.findIndex((item) => item.location === expense._id.location);
            const monthIndex = regDates.findIndex((date) => date === expense._id.regDate);

            if (locationIndex !== -1 && monthIndex !== -1) {
                originalLocationDataResult[locationIndex].monthlyExpenses[monthIndex] = parseFloat(expense.totalExpense.toFixed(2));
            }
        });


        // 计算统计数据
        originalLocationDataResult.forEach((locationData) => 
            {
                const { monthlyExpenses } = locationData;

                // 过滤非零的月支出
                const nonZeroExpenses = monthlyExpenses.filter((expense) => expense > 0);

                // 计算统计值
                locationData.highestExpense = Math.max(...monthlyExpenses);
                locationData.lowestExpense = nonZeroExpenses.length > 0 ? Math.min(...monthlyExpenses) : 0;
                locationData.totalExpense = parseFloat(monthlyExpenses.reduce((sum, val) => sum + val, 0).toFixed(2));
                locationData.averageExpense = nonZeroExpenses.length > 0 ? parseFloat((locationData.totalExpense / 12).toFixed(2)) : 0;
            }
        );
    
        // 计算全年总支出
        const totalAnnualExpense = originalLocationDataResult.reduce((sum, item) => sum + item.totalExpense, 0);

        // // 计算 location 的比重
        originalLocationDataResult.forEach((item) => {
            if (item.totalExpense > 0) {
                item.percentage = parseFloat(((item.totalExpense / totalAnnualExpense) * 100).toFixed(2)) + "%";
            }
        });

        const formatLocationDataResult = originalLocationDataResult.map(item => {
            // const formattedRegDate = item.regDate.slice(5, 8);
            return{
                // date: formattedRegDate,
                // Expense: parseFloat(item.totalExpense).toFixed(2),
                location: item.location,
                highestExpense: "$" + parseFloat(item.highestExpense).toFixed(2),
                lowestExpense: "$" + parseFloat(item.lowestExpense).toFixed(2),
                averageExpense: "$" + parseFloat(item.averageExpense).toFixed(2),
                totalExpense: "$" + parseFloat(item.totalExpense).toFixed(2),
                originalTotalExpense: item.totalExpense,
                highestExpense: "$" + parseFloat(item.highestExpense).toFixed(2),
                percentage:  item.percentage,
            }
        });
    
        const annualTotalExpense =  parseFloat(totalAnnualExpense).toFixed(2)

        // 找到 totalExpense 最高的 location
        const highestExpenseLocation = originalLocationDataResult.reduce((max, location) => {
            return location.totalExpense > max.totalExpense ? location : max;
        }, { location: '', totalExpense: 0 }); // 初始值




        // 初始化结果对象，确保每个 regDate 和 location 都有数据
        const originalMonthlyLocationExpenseResult = regDates.map((regDate) => {
            const formatRegDate = regDate.slice(5, 8); // 提取前 8 位字符 (只保留月份缩写)
            const initialData = { month: formatRegDate };
    
            // 初始化每个 location 的支出为 0
            locationNames.forEach((location) => {
            initialData[location] = 0;
            });
    
            return initialData;
        });
    
        // 填充支出数据
        locationExpenses.forEach((expense) => {
            const regDateIndex = regDates.findIndex((date) => date === expense._id.regDate);
    
            if (regDateIndex !== -1) {
            const location = expense._id.location;
            const totalExpense = parseFloat(expense.totalExpense).toFixed(2);
    
            // 更新结果中的支出数据
            originalMonthlyLocationExpenseResult[regDateIndex][location] = totalExpense;
            }
        });

        res.status(200).json({year,formatMonthlyExpenseResult,formatLocationDataResult,annualTotalExpense,originalMonthlyLocationExpenseResult,highestExpenseLocation, highestMonthlyExpense,lowestMonthlyExpense});
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;