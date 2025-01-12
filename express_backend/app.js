require('dotenv').config(); // 载入环境变量
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const { Server } = require('socket.io');
const http = require('http');
const redis = require('redis'); // 引入 Redis
const oauthService = require('./services/oauthService');
const { initializeDatabaseConnection, registerUser, loginUser } = require('./services/loginService');
const chatSocket = require('./sockets/chatSocket'); // 引入 WebSocket 逻辑

// 创建 Redis 客户端
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});
redisClient.connect();
redisClient.on('error', (err) => {
    console.error('Redis 错误:', err);
});

redisClient.on('connect', () => {
    console.log('已连接到 Redis');
});

// MongoDB 连接
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB 连接成功！'))
  .catch(err => console.error('MongoDB 连接失败:', err));

// 初始化 Express 应用
const app = express();

// 中间件
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析 JSON 请求体

// 初始化 MySQL 连接
initializeDatabaseConnection();

// 初始化 Passport
app.use(passport.initialize());

// OAuth 路由
oauthService(app);

// 注册和登录路由
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

// 创建 HTTP 服务器
const server = http.createServer(app);

// 初始化 Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // 设置允许的前端地址
        methods: ['GET', 'POST'],
    },
});

// WebSocket 逻辑，传递 redisClient 以供存储消息到 Redis
chatSocket(io, redisClient);

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
