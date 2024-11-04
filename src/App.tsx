import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatSidebar from './components/ChatSidebar';
import ChatArea from './components/ChatArea';
import UserPanel from './components/UserPanel';

// Create socket connection with retry logic
const createSocket = () => {
  const socket = io('http://localhost:3000', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  return socket;
};

const socket = createSocket();

interface Message {
  content: string;
  userId: string;
  channelId: string;
  timestamp: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChannel, setCurrentChannel] = useState('general');
  const [user] = useState({
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name: `User ${Math.floor(Math.random() * 1000)}`
  });

  useEffect(() => {
    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (content: string) => {
    const messageData = {
      content,
      userId: user.id,
      channelId: currentChannel,
      timestamp: new Date().toISOString()
    };
    socket.emit('message', messageData);
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <ChatSidebar 
        currentChannel={currentChannel}
        onChannelSelect={setCurrentChannel}
      />
      <div className="flex-1 flex flex-col">
        <ChatArea 
          messages={messages}
          currentChannel={currentChannel}
          onSendMessage={sendMessage}
        />
      </div>
      <UserPanel currentUser={user} />
    </div>
  );
}

export default App;