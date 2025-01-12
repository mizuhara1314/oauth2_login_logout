const { storeMessage, getMessages } = require('../services/redisService');

module.exports = (io, redisClient) => {
    io.on('connection', (socket) => {
        console.log('新用户已连接:', socket.id);

        const roomId = 'defaultRoom'; // 默认房间 ID，可根据需求动态生成

        // 加载历史消息
        getMessages(redisClient, roomId).then((messages) => {
            socket.emit('load-messages', messages);
        });

        // 接收消息
        socket.on('message', async (message) => {
            console.log('收到消息:', message);

            // 将消息存储到 Redis
            await storeMessage(redisClient, roomId, message);

            // 广播消息到所有客户端
            io.emit('message', message);
        });

        // 用户断开连接
        socket.on('disconnect', () => {
            console.log('用户已断开:', socket.id);
        });
    });
};
