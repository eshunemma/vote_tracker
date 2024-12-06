import React from 'react';
import { useStore } from '../../store/useStore';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const currentAgent = useStore(state => state.currentAgent);
  const setCurrentAgent = useStore(state => state.setCurrentAgent);
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentAgent(null);
    navigate('/');
  };

  if (!currentAgent) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                Vote Counting System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Agent: {currentAgent.name}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}