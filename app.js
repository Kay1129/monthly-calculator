const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//引用中间件
const cors = require('cors');
const app = express();

// 使用中间件
app.use(bodyParser.json());

app.use(cors({
    origin: ['http://localhost:3001', 'http://192.168.50.56:3001'], // 替换为你的前端 URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// app.use(cors());
app.use(express.json()); 

// 引用路由
const uploadExpenseRoute = require('./routers/uploadExpense');
const personalDetailRoute = require('./routers/dashboardDetail');
const annualSummaryRoute = require('./routers/annualSummary');
const personalDetailListRoute = require('./routers/personalDetailList');
const monthlyDetailRoute = require('./routers/monthlyDetail');
const familyMemberRoute = require('./routers/familyMember');


// 使用路由
app.use('/api', uploadExpenseRoute); 
app.use('/api', personalDetailRoute); 
app.use('/api', annualSummaryRoute); 
app.use('/api', personalDetailListRoute); 
app.use('/api', monthlyDetailRoute); 
app.use('/api', familyMemberRoute); 


// 连接 MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/monthlyCalculator';
mongoose.connect(mongoURI, {});
const db = mongoose.connection;
//连接成功返回：
db.on('connected', () => {
    console.log('MongoDB connected successfully!');
});
//连接失败返回：
db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});


// 启动 Express 服务
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
