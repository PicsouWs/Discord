import React from 'react';

interface ChatSidebarProps {
  currentChannel: string;
  onChannelSelect: (channel: string) => void;
}

const channels = ['general', 'random', 'help'];

function ChatSidebar({ currentChannel, onChannelSelect }: ChatSidebarProps) {
  return (
    <div className="w-64 bg-gray-900 p-4">
      <h2 className="text-xl font-bold mb-4">Channels</h2>
      <ul>
        {channels.map((channel) => (
          <li
            key={channel}
            className={`cursor-pointer p-2 rounded ${
              channel === currentChannel ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
            onClick={() => onChannelSelect(channel)}
          >
            # {channel}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatSidebar;