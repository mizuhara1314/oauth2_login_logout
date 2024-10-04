const mongoose = require('mongoose');

// 定義 MongoDB 用戶 Schema (OAuth 用戶)
const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    isLoggedIn: { type: Boolean, default: false } // 新增字段，默認為 false
});

// 定義 MongoDB 用戶模型
const MongoUser = mongoose.model('MongoUser', userSchema);

// 定義 MySQL 用戶結構（帳號密碼註冊用戶）
const MySQLUser = {
    username: {
        type: String,
        allowNull: false,
        unique: true // 保證 username 唯一
    },
    password: {
        type: String,
        allowNull: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false // 默認為 false
    }
};

// 匯出 MongoUser 模型和 MySQL 用戶結構
module.exports = {
    MongoUser,
    MySQLUser // 这里你可以选择导出或不导出
};
