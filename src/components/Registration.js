import React, { useState } from 'react';
import axios from 'axios';

const Registration = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [gameName, setGameName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [passkeyVerified, setPasskeyVerified] = useState(false);

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
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
