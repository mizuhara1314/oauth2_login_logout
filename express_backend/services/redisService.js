// 存储消息到 Redis
const storeMessage = async (client, roomId, message) => {
    try {
        const key = `chatroom:${roomId}`;
        await client.rPush(key, JSON.stringify(message)); // 添加消息到列表
        await client.expire(key, 60 * 60 * 24); // 设置过期时间为 24 小时
    } catch (err) {
        console.error('存储消息到 Redis 失败:', err);
    }
};

// 获取消息记录
const getMessages = async (client, roomId) => {
    try {
        const key = `chatroom:${roomId}`;
        const messages = await client.lRange(key, 0, -1); // 获取所有消息
        return messages.map((msg) => JSON.parse(msg));
    } catch (err) {
        console.error('从 Redis 获取消息失败:', err);
        return [];
    }
};

module.exports = {
    storeMessage,
    getMessages,
};
