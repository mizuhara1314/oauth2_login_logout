const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { MongoUser } = require('../models/userModel'); // 引入 MongoUser 模型

// Google OAuth 策略设置
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // 检查用户是否已经存在
        let user = await MongoUser.findOne({ googleId: profile.id }); // 使用 MongoUser

        if (!user) {
            // 创建新用户
            user = new MongoUser({ // 使用 MongoUser 创建新用户
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                isLoggedIn: true // 设置用户为已登录
            });
            await user.save();
        } else {
            // 用户已存在，更新登录状态
            user.isLoggedIn = true; // 设置用户为已登录
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

// 定义 OAuth 路由
module.exports = (app) => {
    // Google OAuth 登录路由
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'consent' })); // 每次都要求用户确认

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
};
