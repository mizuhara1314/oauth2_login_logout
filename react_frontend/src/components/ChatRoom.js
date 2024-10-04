import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import socket from '../services/socket'; // 假设你已经在 services 中设置好 WebSocket 连接
import '../styles/ChatRoom.css'; // 导入样式
import MessageInput from './MessageInput'; // 文字输入组件
import ImageUpload from './ImageUpload'; // 图片上传组件
import Logout from './Logout'; // 导入 Logout 组件

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null); // 用于自动滚动到底部
  const navigate = useNavigate(); // 创建导航函数

  // 在组件挂载时检查 JWT
  useEffect(() => {
    const token = localStorage.getItem('token'); // 假设 JWT 存储在 localStorage 中
    if (!token) {
      navigate('/login'); // 如果没有 JWT，重定向到登录页面
    }
  }, [navigate]); // 确保 navigate 被传入依赖列表中

  // 监听 WebSocket 消息
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message'); // 清理事件监听
    };
  }, []);

  // 自动滚动到最新消息
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 发送文本消息
  const sendMessage = (text) => {
    if (text.trim() === '') return;

    const message = {
      type: 'text',
      content: text,
      sender: 'user',  // 假设你有用户信息
      timestamp: new Date(),
    };

    socket.emit('message', message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // 发送图片消息
  const sendImage = (image) => {
    if (!image) return;

    const message = {
      type: 'image',
      content: image,
      sender: 'user',
      timestamp: new Date(),
    };

    socket.emit('message', message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // 处理登出逻辑
  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('token'); // 移除 JWT
    socket.disconnect(); // 断开 socket 连接（如果需要）
    navigate('/login'); // 导航到登录页面
  };

  return (
    <div className="chat-room">
      <Logout onLogout={handleLogout} /> {/* 添加 Logout 组件 */}
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.type === 'text' && <p>{message.content}</p>}
            {message.type === 'image' && (
              <img src={message.content} alt="Uploaded" className="chat-image" />
            )}
            <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messageEndRef}></div> {/* 自动滚动的锚点 */}
      </div>
      <div className="input-container">
        <MessageInput onSend={sendMessage} />
        <ImageUpload onUpload={sendImage} />
      </div>
    </div>
  );
};

export default ChatRoom;
