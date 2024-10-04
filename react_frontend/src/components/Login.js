import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import axios from 'axios';
import OAuth from './OAuth'; // 引入 OAuth 組件
import '../styles/Auth.css'; // 引入樣式

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // 控制當前是登入還是註冊
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // 获取 navigate 函数
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
  // 處理表單登入
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, { username, password });
      const { token } = response.data;

      // 存儲 token 或處理登入成功邏輯
      localStorage.setItem('token', token);
      localStorage.setItem('loginMethod', 'mysql');
      alert('登入成功！');
      // 重定向到聊天室
      navigate('/chatroom');
    } catch (error) {
      setError('使用者名稱或密碼錯誤');
    }
  };

  // 處理表單註冊
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${backendUrl}/auth/register`, { username, password });
      setSuccess('註冊成功！');
      setUsername('');
      setPassword('');
    } catch (error) {
      setError('註冊失敗');
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? '登入' : '註冊'}</h2>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        <input
          type="text"
          placeholder="使用者名稱"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="auth-button">{isLogin ? '登入' : '註冊'}</button>
      </form>

      {/* OAuth 登入部分 */}
      <div className="oauth-section">
        <OAuth />

        <div className="toggle-section">
          <span>{isLogin ? '還沒有帳戶？' : '已有帳戶？'}</span>
          <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '註冊' : '登入'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
