import { io } from 'socket.io-client';

// 从 .env 文件中获取后端的 WebSocket 连接 URL
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

// 创建与后端的 WebSocket 连接
const socket = io(SOCKET_URL, {
  autoConnect: false, // 手动连接，在需要时调用 socket.connect()
  transports: ['websocket'], // 确保只使用 WebSocket 传输协议
});

// 连接时的事件处理
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

// 断开连接时的事件处理
socket.on('disconnect', (reason) => {
  console.log(`Disconnected: ${reason}`);
});

// 连接错误处理
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// 导出 socket 实例供其他组件使用
export default socket;
