import React from 'react';

interface User {
  id: string;
  name: string;
}

interface UserPanelProps {
  currentUser: User;
}

function UserPanel({ currentUser }: UserPanelProps) {
  return (
    <div className="w-64 bg-gray-900 p-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          {currentUser.name[0]}
        </div>
        <div>
          <div className="font-bold">{currentUser.name}</div>
          <div className="text-sm text-gray-400">Online</div>
        </div>
      </div>
    </div>
  );
}

export default UserPanel;