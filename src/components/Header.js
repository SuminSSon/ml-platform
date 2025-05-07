import React from 'react';
import { Layers } from 'lucide-react';

function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: '대시보드' },
    { id: 'pods',      label: '파드 관리' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">K8s ML 플랫폼</h1>
        </div>
        <nav className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              } transition`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
