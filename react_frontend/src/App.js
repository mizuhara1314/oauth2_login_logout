import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatRoom />} />   #起始入口
            <Route path="/login" element={<Login />} />
          <Route path="/chatroom" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;