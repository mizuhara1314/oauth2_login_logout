import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../services/socket'; 
import '../styles/ChatRoom.css';
import MessageInput from './MessageInput';
import ImageUpload from './ImageUpload';
import Logout from './Logout';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);
  const navigate = useNavigate();

  // 检查 JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // 监听 WebSocket
  useEffect(() => {
    // 显式连接到 WebSocket 服务器
    socket.connect();

    // 加载历史消息
    socket.on('load-messages', (loadedMessages) => {
      setMessages(loadedMessages);
    });

    // 实时接收消息
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // 清理 WebSocket 事件监听
    return () => {
      socket.off('load-messages');
      socket.off('message');
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
      sender: 'user',
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

  return (
    <div className="chat-room">
      <Logout onLogout={() => navigate('/login')} />
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
        <div ref={messageEndRef}></div>
      </div>
      <div className="input-container">
        <MessageInput onSend={sendMessage} />
        <ImageUpload onUpload={sendImage} />
      </div>
    </div>
  );
};

export default ChatRoom;
