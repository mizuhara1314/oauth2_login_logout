import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuth = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const location = useLocation();  // 用于获取 URL 参数
  const navigate = useNavigate();  // 用于导航回主页或其他页面

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

  // 处理 OAuth 回调 URL 中的查询参数
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const user = queryParams.get('user');
    const error = queryParams.get('error');

    if (error) {
      setErrorMessage('授权失败，请重试！');
    } else if (token) {
      // 如果有 token，存储并重定向
      localStorage.setItem('token', token);
      localStorage.setItem('loginMethod', 'oauth');
      if (user) {
        const userData = JSON.parse(user);
        // 可以在此处存储用户信息，如果需要
        console.log('用户信息:', userData);
      }
      navigate('/chatroom', { replace: true }); // 重定向到聊天室
    }
  }, [location, navigate]);

  // 处理用户点击 OAuth 登录按钮
  const handleOAuthLogin = () => {
    // 直接跳转到后端的 Google 登录路由
    window.location.href =`${backendUrl}/auth/google`;
  };

  return (
    <div className="oauth-container">
      <button onClick={handleOAuthLogin} className="oauth-button">
        使用 Google 登录
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default OAuth; 