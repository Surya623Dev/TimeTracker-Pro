import React from 'react';

const Header: React.FC = () => {
  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Welcome back!</h2>
            <p className="text-sm text-gray-500">{getCurrentTime()}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;