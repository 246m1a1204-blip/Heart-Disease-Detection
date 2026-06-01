import React, { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';

export default function App() {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState('Patient');

  const handleAuthSuccess = (jwtToken, role) => {
    setToken(jwtToken);
    setUserRole(role);
  };

  if (!token) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900/30 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          ❤️ Heart Disease AI Portal
        </h1>
        <button onClick={() => setToken(null)} className="text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors">
          Log Out Session
        </button>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-7xl w-full mx-auto overflow-hidden">
        <div className="h-[calc(100vh-140px)]">
          <Dashboard role={userRole} />
        </div>
        <div className="h-[calc(100vh-140px)]">
          <Chatbot />
        </div>
      </main>
    </div>
  );
}