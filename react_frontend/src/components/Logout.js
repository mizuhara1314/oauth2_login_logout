import React from 'react';

const Logout = () => {
  const handleLogout = () => {
    // 清除 token 和登錄方式
    localStorage.removeItem('token'); // 清除 token
    localStorage.removeItem('loginMethod'); // 清除登錄方式
    alert('您已成功登出！'); // 提示登出成功
    window.location.href = '/login'; // 跳轉到登入頁面
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      登出帳戶
    </button>
  );
};

export default Logout;
