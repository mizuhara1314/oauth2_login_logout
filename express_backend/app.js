require('dotenv').config(); // 載入環境變數
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
const oauthService = require('./services/oauthService'); // 引入 OAuth 服务
const { initializeDatabaseConnection, registerUser, loginUser } = require('./services/loginService'); // 引入 loginService 和需要的函數

// MongoDB 连接
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB 连接成功！'))
  .catch(err => console.error('MongoDB 连接失败:', err));

// 初始化 Express 应用
const app = express();

// 使用 CORS 中间件，允许跨域请求
app.use(cors());
app.use(express.json()); // 解析 JSON 請求體

// 初始化 MySQL 连接并创建 users 表
initializeDatabaseConnection();

// 初始化 Passport 中间件
app.use(passport.initialize());

// 引入 OAuth 路由
oauthService(app);

// 註冊和登入路由
app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await registerUser(username, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await loginUser(username, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
