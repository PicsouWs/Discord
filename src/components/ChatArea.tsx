import React, { useState, useRef, useEffect } from 'react';

interface Message {
  content: string;
  userId: string;
  channelId: string;
  timestamp: string;
}

interface ChatAreaProps {
  messages: Message[];
  currentChannel: string;
  onSendMessage: (content: string) => void;
}

function ChatArea({ messages, currentChannel, onSendMessage }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">#{currentChannel}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages
          .filter((msg) => msg.channelId === currentChannel)
          .map((message, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-baseline">
                <span className="font-bold">{message.userId}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1">{message.content}</p>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Message #${currentChannel}`}
          className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
    </div>
  );
}

export default ChatArea;