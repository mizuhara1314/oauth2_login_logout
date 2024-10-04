const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');

// 加载环境变量
dotenv.config();

// 导入用户模型
const User = require('./models/userModel'); // 引入 userModel

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

// Google OAuth 策略设置
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google Profile:', profile);

        // 检查用户是否已经存在
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            // 创建新用户
            user = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
            });
            await user.save();
        }

        // 生成 JWT 并返回用户信息
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        done(null, { token, user });
    } catch (error) {
        console.error('Error during authentication:', error);
        done(error, null);
    }
}));

// 序列化用户
passport.serializeUser((user, done) => {
    done(null, user);
});

// 反序列化用户
passport.deserializeUser((user, done) => {
    done(null, user);
});

// 初始化 Passport 中间件
app.use(passport.initialize());

// Google OAuth 登录路由
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth 回调路由
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const { token, user } = req.user;
    if (token && user) {
        // 将 token 和用户信息通过查询参数传递给前端
        res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    } else {
        res.status(400).json({ error: '登录失败' });
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
