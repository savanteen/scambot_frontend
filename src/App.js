import React, { useState, useEffect } from 'react';
import Registration from './components/Registration';
import ChatInterface from './components/ChatInterface';
import Leaderboard from './components/Leaderboard';
import Instructions from './components/Instructions';

function App() {
  // Store complete user object (userId, email, gameName)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('scambot_user');
    return stored ? JSON.parse(stored) : null;
  });
  
  useEffect(() => {
    console.log("App component - Current user:", user);
  }, [user]);

  const handleRegister = (userData) => {
    console.log("Registration successful:", userData);
    setUser(userData);
    localStorage.setItem('scambot_user', JSON.stringify(userData));
  };
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('scambot_user');
    localStorage.removeItem('scambot_userId'); // Clean up old storage
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Educational Scambot Challenge</h1>
        <p className="text-gray-600 text-center mb-4">Learn about scam techniques by role-playing as the scammer</p>
      </header>
      
      <main className="max-w-4xl mx-auto">
        {!user ? (
          <Registration onRegister={handleRegister} />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Playing as: <span className="font-semibold">{user.gameName}</span> ({user.email})
              </p>
              <button 
                onClick={handleLogout} 
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Logout
              </button>
            </div>
            
            <Instructions />
            
            {/* Pass user object but ChatInterface can access as user.gameName, user.email, etc */}
            <ChatInterface userId={user.gameName} userEmail={user.email} userObj={user} />
            
            <Leaderboard />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;