const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 定義 MySQL 連接
let mysqlConnection;

// 初始化 MySQL 连接並創建 users 資料表
const initializeDatabaseConnection = () => {
    mysqlConnection = mysql.createConnection({
        host: process.env.MYSQL_HOST,    
        user: process.env.MYSQL_USER,   
        password: process.env.MYSQL_PASSWORD, 
        database: process.env.MYSQL_DATABASE  
    });

    mysqlConnection.connect((error) => {
        if (error) {
            console.error('Error connecting to MySQL:', error);
        } else {
            console.log('Connected to MySQL database.');

            // 創建 users 資料表（如果不存在）
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    isLoggedIn BOOLEAN DEFAULT false
                );
            `;
            mysqlConnection.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating users table:', err);
                } else {
                    console.log('Users table is ready.');
                }
            });
        }
    });
};

// 用戶註冊
const registerUser = async (username, password) => {
    try {
        // 檢查是否已經有相同的 username
        const query = 'SELECT * FROM users WHERE username = ?';
        const existingUser = await new Promise((resolve, reject) => {
            mysqlConnection.query(query, [username], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });

        if (existingUser) {
            throw new Error('該使用者名稱已經存在');
        }

        // Hash 密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        // 將用戶存入數據庫
        const insertQuery = 'INSERT INTO users (username, password, isLoggedIn) VALUES (?, ?, false)';
        await new Promise((resolve, reject) => {
            mysqlConnection.query(insertQuery, [username, hashedPassword], (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        return { message: '註冊成功！' };
    } catch (error) {
        throw new Error('註冊失敗: ' + error.message);
    }
};

// 用戶登入
const loginUser = async (username, password) => {
    try {
        // 查找用戶
        const query = 'SELECT * FROM users WHERE username = ?';
        const user = await new Promise((resolve, reject) => {
            mysqlConnection.query(query, [username], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });

        if (!user) {
            throw new Error('用戶名稱或密碼錯誤');
        }

        // 比較密碼
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('用戶名稱或密碼錯誤');
        }

        // 更新 isLoggedIn 為 true
        const updateQuery = 'UPDATE users SET isLoggedIn = true WHERE username = ?';
        await new Promise((resolve, reject) => {
            mysqlConnection.query(updateQuery, [username], (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        // 生成 JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { message: '登入成功！', token };
    } catch (error) {
        throw new Error('登入失敗: ' + error.message);
    }
};


module.exports = { initializeDatabaseConnection, registerUser, loginUser };
