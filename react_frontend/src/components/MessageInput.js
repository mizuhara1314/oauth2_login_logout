import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止表单提交的默认行为
    onSend(inputValue);
    setInputValue(''); // 发送后清空输入框
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="输入消息..."
        className="input-field"
      />
      <button type="submit" className="send-button">发送</button>
    </form>
  );
};

export default MessageInput;
