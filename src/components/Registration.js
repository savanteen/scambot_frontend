import React, { useState } from 'react';
import axios from 'axios';

const Registration = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [gameName, setGameName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [passkeyVerified, setPasskeyVerified] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);

  const handlePasskeyVerification = (e) => {
    e.preventDefault();
    if (passkey === 'NYJCnoscam') {
      setPasskeyVerified(true);
      setError('');
    } else {
      setError('Invalid passkey');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('https://scamboteducationplatform-production-c988.up.railway.app/api/users/register', {
        email,
        gameName
      });
      
      onRegister({
        userId: response.data.userId,
        email: response.data.email,
        gameName: response.data.gameName
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!passkeyVerified) {
    return (
      {/* Logo and Educational Image Section */}
<div className="text-center mb-4">
  {/* Tembusu Games Logo */}
  <img 
    src="https://tembusugames.co/cdn/shop/files/TembusuLogoCentreWords.png?v=1763389811&width=150" 
    alt="Tembusu Games" 
    className="w-20 h-12 mx-auto mb-3 object-contain"
    onError={(e) => {
      e.target.style.display = 'none';
    }}
  />
  
  {/* Educational Scammer vs Victim Image - Full Width */}
  <img 
    src="https://cdn.shopify.com/s/files/1/0725/5402/0887/files/scamvsvictim.png?v=1763391088" 
    alt="Scammer vs Victim Educational Simulation" 
    className="w-full h-24 mb-2 object-cover rounded"
    onError={(e) => {
      e.target.style.display = 'none';
    }}
  />
  
  <div className="text-center text-xs text-gray-400 mb-2">
    Role-play as a scammer to scam a victim in this immersive finlit game!
  </div>
</div>

        <h2 className="text-2xl font-bold mb-4 text-center">Educational Scambot Simulation</h2>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">DISCLAIMER</p>
          <p>This is an educational tool to help you understand scam tactics. The knowledge gained should only be used for protection and awareness. Misuse of this information for actual scamming is illegal and unethical.</p>
        </div>
        
        <form onSubmit={handlePasskeyVerification}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passkey">
              Enter Passkey
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                id="passkey"
                type={showPasskey ? "text" : "password"}
                placeholder="Enter passkey to continue"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPasskey(!showPasskey)}
              >
                {showPasskey ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Verify
            </button>
          </div>
        </form>

        {/* Copyright Notice */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Tembusu Games Pte Ltd. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Created for educational purposes only
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Logo and Educational Image Section */}
      <div className="text-center mb-4">
        {/* Tembusu Games Logo */}
        <img 
          src="https://tembusugames.co/cdn/shop/files/TembusuLogoCentreWords.png?v=1763389811&width=150" 
          alt="Tembusu Games" 
          className="w-20 h-12 mx-auto mb-3 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        {/* Educational Scammer vs Victim Image */}
        <img 
          src="https://cdn.shopify.com/s/files/1/0725/5402/0887/files/scamvsvictim.png?v=1763391088" 
          alt="Scammer vs Victim Educational Simulation" 
          className="w-32 h-20 mx-auto mb-2 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        <div className="text-center text-xs text-gray-500 mb-2">
          🤖 AI-powered educational simulation
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">Register for the Scam Challenge</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameName">
            Game Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="gameName"
            type="text"
            placeholder="Choose a game name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Start Game'}
          </button>
        </div>
      </form>

      {/* Copyright Notice */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          © 2025 Tembusu Games Pte Ltd. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Created for educational purposes only
        </p>
      </div>
    </div>
  );
};

export default Registration;

