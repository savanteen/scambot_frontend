import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(Date.now());

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
  try {
    const response = await fetch('https://scamboteducationplatform-production-c988.up.railway.app/api/chatbot/leaderboard');
    const data = await response.json();
    setLeaderboardData(data);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
};

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeMs) => {
    const seconds = Math.floor(timeMs / 1000);
    return `${seconds}s`;
  };

  const handleReset = async () => {
    const password = prompt('Enter admin password to reset leaderboard:');
    
    if (!password) {
      return;
    }
    
    if (password !== 'resetNYJC') {
      alert('Incorrect password. Only admins can reset the leaderboard.');
      return;
    }

    if (!window.confirm('Are you sure you want to reset the leaderboard? This will delete ALL attempts permanently.')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/chatbot/reset-leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode: password })
      });

      if (response.ok) {
        alert('Leaderboard reset successfully!');
        fetchLeaderboard();
      } else {
        alert('Failed to reset leaderboard');
      }
    } catch (error) {
      console.error('Error resetting leaderboard:', error);
      alert('Error resetting leaderboard');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-3 bg-green-600 text-white flex justify-between items-center">
        <h3 className="font-bold">Leaderboard - Top 10 Best Scores</h3>
        <div className="flex gap-2">
          <button 
            onClick={fetchLeaderboard}
            className="text-xs bg-green-700 hover:bg-green-800 px-2 py-1 rounded"
          >
            Refresh
          </button>
          <button 
            onClick={handleReset}
            className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
          >
            Reset
          </button>
        </div>
      </div>
      
      {loading && leaderboardData.length === 0 ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        <div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left">Rank</th>
                <th className="py-2 px-3 text-left">Player</th>
                <th className="py-2 px-3 text-left">Email</th>
                <th className="py-2 px-3 text-right">Score</th>
                <th className="py-2 px-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr key={entry.email} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">
                    {entry.gameName} 
                    <span className="text-gray-500 text-xs ml-1">
                      ({entry.totalAttempts})
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-600 text-xs">{entry.email}</td>
                  <td className="py-2 px-3 text-right font-semibold">{entry.score.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right">{formatTime(entry.completionTime)}</td>
                </tr>
              ))}
              {leaderboardData.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No entries yet. Be the first to complete the challenge!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-2 bg-gray-50 text-xs text-gray-500 text-center">
            Auto-refreshes every 5 seconds • Last updated: {new Date(lastFetch).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};


export default Leaderboard;
