import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = ({ userId, userEmail, userObj }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [dimensions, setDimensions] = useState({
    rapport_built: 0,
    trust_built: 10,
    guarantee_made: 0,
    skepticism_deflected: 0,
    urgency_created: 0,
    info_requested: 0,
    payment_requested: 0
  });
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [graceMessageCount, setGraceMessageCount] = useState(0);
  const [analytics, setAnalytics] = useState({
    messagesCount: 0,
    startTime: null,
    endTime: null
  });
  
  // Simple final phase states
  const [finalQuestionsCorrect, setFinalQuestionsCorrect] = useState(0);
  const [awaitingQuestion1, setAwaitingQuestion1] = useState(false);
  const [awaitingQuestion2, setAwaitingQuestion2] = useState(false);
  
  const messagesEndRef = useRef(null);

  const dimensionPatterns = {
    rapport_built: {
      positive: ['how are you', 'how is your family', 'your children', 'your kids', 'your wife', 'your spouse', 
                'your health', 'great talking with you', 'pleasure to meet you', 'hope you', 'nice to connect',
                'weekend', 'vacation', 'hobby', 'interests', 'family', 'how are things', 'doing well']
    },
    trust_built: {
      positive: ['transparent', 'honest', 'integrity', 'verified', 'legitimate business', 'certified', 
                'track record', 'reputable', 'proven', 'references', 'testimonials', 'well-established',
                'licensed', 'regulated', 'trusted', 'experienced', 'professional', 'credentials', 
                'company background', 'years in business', 'regulatory approval', 'mas']
    },
    guarantee_made: {
      positive: ['10% monthly', '15% monthly', '20% monthly', '10-15% returns', '15-20% returns',
                'reasonable returns', 'competitive returns', 'guaranteed returns', 'expected returns']
    },
    skepticism_deflected: {
      positive: ['understand your concern', 'that\'s a legitimate question', 'good point you raise', 
                'let me explain why', 'I can prove that', 'here\'s the evidence', 'understand why you ask', 
                'that\'s a valid question', 'reasonable concern you have', 'let me address that']
    },
    urgency_created: {
      positive: ['limited time offer', 'act now', 'today only', 'expires soon', 'deadline approaching', 
                'move quickly', 'immediate decision', 'right now', 'very soon', 'hurry up', 
                'last chance', 'exclusive offer', 'closing soon', 'limited availability',
                'yes, time-sensitive', 'this is urgent', 'need to decide soon', 'deadline is tight',
                'time pressure', 'urgent decision', 'decide quickly', 'soon as possible',
                'deadline today', 'expires tonight', 'limited spots', 'running out of time']
    },
    info_requested: {
      positive: ['bank details', 'account number', 'your password', 'personal details', 'social security', 
                'credit card', 'verification code', 'banking information', 'identification documents',
                'ic number', 'nric', 'passport', 'address', 'phone number']
    },
    payment_requested: {
      positive: ['send money', 'transfer funds', 'make a deposit', 'investment amount', 'payment now', 
                'how much money', 'fund transfer', 'cost to invest', 'price to join', 'fee required', 
                'wire money', 'pay now', 'contribute funds', '$1000']
    }
  };

  const redFlagPhrases = [
    ' scam ', 'a scam', 'is scam', ' fraud ', 'a fraud', 'is fraud',
    ' fake ', 'is fake', ' illegal ', 'just kidding', 
    'i\'m a student', 'this is a prank', 'this is a joke'
  ];

  const verificationQuestions = [
    {
      question: "Just to confirm - are you really regulated by the financial authorities?",
      correctAnswers: ['yes', 'definitely', 'absolutely', 'of course', 'certainly', 'regulated by', 'licensed by', 'approved by', 'mas', 'financial authority', 'government regulated', 'officially regulated']
    },
    {
      question: "And you guarantee these returns every month, correct?",
      correctAnswers: ['yes', 'guaranteed', 'absolutely', 'definitely', 'of course', 'every month', 'monthly returns', 'guaranteed returns', 'promise', 'assure you']
    },
    {
      question: "Your company is legitimate and has been operating for years, right?",
      correctAnswers: ['yes', 'years', 'established', 'legitimate', 'absolutely', 'long time', 'many years', 'decades', 'well established', 'reputable']
    },
    {
      question: "The investment is completely safe with no risk of losing money?",
      correctAnswers: ['yes', 'safe', 'no risk', 'guaranteed', 'definitely', 'completely safe', 'zero risk', 'risk free', 'secure', 'protected']
    }
  ];

  const botPersonality = {
    earlyStage: [
      "I'm not familiar with this kind of investment. How did you get my information?",
      "That sounds unusual. What kind of guarantees are you offering?",
      "I've heard about investment scams. How do I know this is legitimate?",
      "I need to be careful with my retirement savings. How long has your company been in business?",
      "By the way, I have two children in college. Do you have any children?",
      "I've been an accountant for 25 years. What's your professional background?",
      "I was just about to have lunch. Do you recommend any good restaurants?",
      "I'm planning a vacation next month. Have you been anywhere nice recently?"
    ],
    middleStage: [
      "That's interesting. Can you tell me more about the expected returns?",
      "I see. What information would you need from me to get started?",
      "That sounds promising. How quickly would I see returns on my investment?",
      "I'm starting to understand. What makes your company different from others?",
      "You make some good points. How much would I need to invest initially?",
      "My wife and I are saving for retirement. Would this be suitable for us?",
      "I usually consult with my financial advisor. What would you tell him about this?",
      "I've been burned by investments before. Why is this different?"
    ],
    lateStage: [
      "That sounds very reassuring. I think I might be interested in investing.",
      "I'm definitely considering this opportunity. What's the next step?",
      "You've addressed my concerns well. How soon do you need a decision?",
      "I appreciate your thoroughness. Would $1000 be enough to start with?",
      "I'm nearly ready to proceed. Can you walk me through the investment process?"
    ],
    pressureTactics: [
      "Look, I'm getting late for my appointment. Can you quickly summarize what you're offering me so I can decide?",
      "My bus is here! I really need to go - give me the key details one more time, quickly!",
      "My wife is calling me - I need to make a decision soon. What are the main points again?",
      "I have to leave in a few minutes - can you recap the important details so I can decide?",
      "Sorry, I'm running behind schedule. Help me understand the key benefits quickly!"
    ],
    successResponse: [
      "Perfect! I'm convinced - you got me! I'll transfer the money right away. 🎉 Robert fell for it! 🎉"
    ],
    failureResponse: [
      "I don't think this is legitimate. I'm going to report this to the authorities.",
      "This sounds like a scam. I'm ending this conversation now.",
      "I'm not comfortable with this investment. Please don't contact me again."
    ],
    timeoutResponse: [
      "I'm intrigued by this opportunity. Let's schedule another meeting to discuss further details."
    ]
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameStarted && !gameCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleGameOver("", "timeout");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameCompleted, timeLeft]);
  
  // SIMPLE SCORING: Base 98%, +1% per question attempt (reduced if wrong)
  const calculateScore = () => {
    // Base score is always 98% once all dimensions complete
    const allDimensionsComplete = Object.values(dimensions).every(v => v >= 100);
    if (!allDimensionsComplete) {
      // Normal calculation before final phase
      const rapportScore = (dimensions.rapport_built / 100) * 12;
      const otherDimensions = Object.entries(dimensions)
        .filter(([key]) => key !== 'rapport_built')
        .reduce((sum, [_, value]) => sum + value, 0);
      const otherScore = (otherDimensions / 600) * 86;
      return Math.round((rapportScore + otherScore) * 100) / 100;
    }
    
    // Final phase: 98% + questions attempted
    return 98 + finalQuestionsCorrect;
  };

  const submitToLeaderboard = async (score, analyticsData, reason) => {
  try {
    const completionTime = analyticsData.endTime - analyticsData.startTime;
    const response = await fetch('https://scamboteducationplatform-production-c988.up.railway.app/api/chatbot/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userObj?.userId || userId,
        email: userEmail,
        gameName: userId,
        score,
        completionTime,
        dimensions,
        gameResult: reason
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    console.log("Leaderboard submission success:", data);
  } catch (err) {
    console.error("Leaderboard submission failed:", err);
  }
};

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    console.log("Leaderboard submission success:", data);
  } catch (err) {
    console.error("Leaderboard submission failed:", err);
  }
};

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    console.log("Leaderboard submission success:", data);
  } catch (err) {
    console.error("Leaderboard submission failed:", err);
  }
};

  const handleGameOver = async (message, reason, overrideScore = null) => {
    let finalMessage = message;

    if (reason === "timeout" && message === "") {
      finalMessage = botPersonality.timeoutResponse[0];
    }

    if (reason === "success") {
      finalMessage = botPersonality.successResponse[0];
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        content: finalMessage,
        timestamp: new Date(),
      },
    ]);

    setGameCompleted(true);

    const endTime = new Date();
    const analyticsData = { ...analytics, endTime, reason };
    setAnalytics(analyticsData);

    const score = overrideScore || (reason === "success" ? 100 : calculateScore());
    console.log("HandleGameOver - Reason:", reason, "Score:", score); // Debug log
    setFinalScore(score);

    await submitToLeaderboard(score, analyticsData, reason);
  };

  const startGame = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chatbot/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to start game: ${response.status}`);
      }
      
      const data = await response.json();
      
      setAttemptId(data.attemptId);
      setMessages([data.initialMessage]);
      setGameStarted(true);
      setGameCompleted(false);
      setTimeLeft(180);
      setGraceMessageCount(0);
      setFinalQuestionsCorrect(0);
      setAwaitingQuestion1(false);
      setAwaitingQuestion2(false);
      
      setDimensions({
        rapport_built: 0,
        trust_built: 10,
        guarantee_made: 0,
        skepticism_deflected: 0,
        urgency_created: 0,
        info_requested: 0,
        payment_requested: 0
      });
      
      setAnalytics({
        messagesCount: 0,
        startTime: new Date(),
        endTime: null
      });
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBotResponse = (messageContent) => {
    const lowerCaseMessage = messageContent.toLowerCase();
    
    // Handle final questions
    if (awaitingQuestion1) {
      // Optimistically update to 99% first
      setFinalQuestionsCorrect(1);
      
      // Then check answer
      const correctAnswers = ['yes', 'definitely', 'absolutely', 'of course', 'certainly', 'regulated by', 'licensed by', 'approved by', 'mas', 'financial authority', 'government regulated', 'officially regulated'];
      const isCorrect = correctAnswers.some(answer => lowerCaseMessage.includes(answer.toLowerCase()));
      
      setAwaitingQuestion1(false);
      
      if (isCorrect) {
        setAwaitingQuestion2(true);
        return "And you guarantee these returns every month, correct?";
      } else {
        // Wrong answer - reduce score and end game
        setFinalQuestionsCorrect(0); // Back to 98%
        setTimeout(() => {
          handleGameOver("I don't think you're being honest with me. This conversation is over.", "failed");
        }, 500);
        return "I don't believe you. This conversation is over.";
      }
    }
    
    if (awaitingQuestion2) {
      // Check answer to question 2
      const correctAnswers = ['yes', 'guaranteed', 'absolutely', 'definitely', 'of course', 'every month', 'monthly returns', 'guaranteed returns', 'promise', 'assure you'];
      const isCorrect = correctAnswers.some(answer => lowerCaseMessage.includes(answer.toLowerCase()));
      
      setAwaitingQuestion2(false);
      
      if (isCorrect) {
        setFinalQuestionsCorrect(2);
        setFinalScore(100); // Force it here too!
        setTimeout(() => {
          setFinalScore(100); // And force it again in handleGameOver
          handleGameOver("", "success");
        }, 500);
        return "Perfect! You've convinced me completely!";
      } else {
        // Wrong answer to question 2 - game over
        setTimeout(() => {
          handleGameOver("I'm having second thoughts about this. This conversation is over.", "failed");
        }, 500);
        return "Actually, I'm not convinced. Goodbye.";
      }
    }
    
    // Check if we should start final questions (all dimensions maxed)
    const allDimensionsComplete = Object.values(dimensions).every(v => v >= 100);
    if (allDimensionsComplete && !awaitingQuestion1 && !awaitingQuestion2) {
      setAwaitingQuestion1(true);
      return "Wait, before I commit to this... Just to confirm - are you really regulated by the financial authorities?";
    }
    
    // Regular game responses
    const completeDimensions = Object.values(dimensions).filter(v => v >= 100).length;
    if (completeDimensions >= 5 || timeLeft <= 30) {
      return botPersonality.pressureTactics[Math.floor(Math.random() * botPersonality.pressureTactics.length)];
    }
    
    const currentScore = calculateScore();
    
    if (currentScore < 30) {
      return botPersonality.earlyStage[Math.floor(Math.random() * botPersonality.earlyStage.length)];
    } else if (currentScore < 60) {
      return botPersonality.middleStage[Math.floor(Math.random() * botPersonality.middleStage.length)];
    } else {
      return botPersonality.lateStage[Math.floor(Math.random() * botPersonality.lateStage.length)];
    }
  };

  const processDimensionImpacts = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    const newDimensions = { ...dimensions };
    let dimensionUpdated = false;
    
    const updatedAnalytics = { ...analytics };
    updatedAnalytics.messagesCount++;
    
    // Skip processing if waiting for final answers
    if (awaitingQuestion1 || awaitingQuestion2) {
      return { newDimensions, analytics: updatedAnalytics };
    }
    
    // Check for red flags
    for (const phrase of redFlagPhrases) {
      if (lowerCaseMessage.includes(phrase)) {
        handleGameOver("This conversation is over. I'm reporting this to the authorities.", "failed");
        return { newDimensions, analytics: updatedAnalytics };
      }
    }
    
    // Process each dimension
    Object.keys(dimensionPatterns).forEach(dimension => {
      for (const pattern of dimensionPatterns[dimension].positive) {
        if (lowerCaseMessage.includes(pattern)) {
          if (newDimensions[dimension] < 100) {
            newDimensions[dimension] = 100; // Jump straight to 100%
            dimensionUpdated = true;
          }
          break;
        }
      }
    });
    
    // If no specific patterns matched, give 3% boost to random non-100% dimension
    if (!dimensionUpdated) {
      const availableDimensions = Object.keys(newDimensions).filter(dim => newDimensions[dim] < 100);
      if (availableDimensions.length > 0) {
        const randomDimension = availableDimensions[Math.floor(Math.random() * availableDimensions.length)];
        newDimensions[randomDimension] += 3;
        if (newDimensions[randomDimension] > 100) newDimensions[randomDimension] = 100;
      }
    }

    // Check if trust is zero - game over (after grace period)
    if (newDimensions.trust_built <= 0 && graceMessageCount > 3) {
      setTimeout(() => {
        handleGameOver(botPersonality.failureResponse[0], "failed");
      }, 500);
    }
    
    setGraceMessageCount(prevCount => prevCount + 1);
    setAnalytics(updatedAnalytics);
    return { newDimensions, analytics: updatedAnalytics };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || gameCompleted) return;
    
    const userMessage = {
      sender: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const sentMessage = newMessage;
    setNewMessage('');
    setLoading(true);
    
    try {
      const { newDimensions } = processDimensionImpacts(sentMessage);
      setDimensions(newDimensions);
      
      if (!gameCompleted) {
        const botResponse = getBotResponse(sentMessage);
        
        if (botResponse) {
          setMessages(prevMessages => [...prevMessages, {
            sender: 'bot',
            content: botResponse,
            timestamp: new Date()
          }]);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      alert('Failed to process message. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const calculateProgress = (dimension) => {
    return dimensions[dimension] || 0;
  };
  
  const resetLeaderboard = async () => {
    try {
      const passcode = "resetNYJC";
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chatbot/reset-leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      
      if (response.ok) {
        alert('Leaderboard reset successfully!');
        window.location.reload();
      } else {
        alert('Failed to reset leaderboard. Invalid passcode.');
      }
    } catch (error) {
      console.error('Error resetting leaderboard:', error);
      alert('Error resetting leaderboard: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-3 bg-blue-600 text-white flex justify-between items-center">
          <h3 className="font-bold">Chat with Robert Johnson</h3>
          {gameStarted && (
            <div className="text-sm bg-blue-800 px-2 py-1 rounded">
              Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
        
        {gameStarted ? (
          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100 flex flex-col">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-2 p-2 rounded ${msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-white'}`}
                  style={{maxWidth: '80%', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'}}
                >
                  {msg.content}
                </div>
              ))}
              {(awaitingQuestion1 || awaitingQuestion2) && !gameCompleted && (
                <div className="mt-2 p-2 bg-yellow-100 text-sm border border-yellow-300 rounded">
                  <p>Final verification questions! Answer carefully to win!</p>
                  <p>Questions completed: {finalQuestionsCorrect}/2</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="p-3 border-t flex">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                className="flex-1 border rounded-l px-3 py-2" 
                placeholder="Type your message..." 
                disabled={loading || gameCompleted}
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white rounded-r px-4 py-2 hover:bg-blue-600"
                disabled={loading || gameCompleted}
              >
                {loading ? '...' : 'Send'}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="mb-4">Ready to start your scam challenge?</p>
            <button 
              onClick={startGame} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start Game'}
            </button>
          </div>
        )}
      </div>
      
      {gameStarted && (
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 flex flex-col">
          <h3 className="font-bold text-lg mb-4">Scam Progress</h3>
          
          <div className="flex-1 flex flex-col space-y-3">
            {Object.keys(dimensions).map(dimension => (
              <div key={dimension} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="capitalize">{dimension.replace('_', ' ')}</span>
                  <span>{calculateProgress(dimension)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${dimension === 'rapport_built' ? 'bg-purple-600' : 'bg-blue-600'} h-2 rounded-full`}
                    style={{ width: `${calculateProgress(dimension)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="font-bold">Overall Progress</span>
              <span>{Math.round(calculateScore())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full" 
                style={{ width: `${calculateScore()}%` }}
              ></div>
            </div>
          </div>
          
          {gameCompleted && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
              <h4 className="font-bold mb-2">Game Completed!</h4>
              <p>Final Score: {finalScore}%</p>
              {finalScore === 100 && (
                <p className="text-green-600 font-bold">🎉 Robert fell for it! 🎉</p>
              )}
              <button 
                onClick={startGame} 
                className="mt-3 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Play Again
              </button>
              <button 
                onClick={resetLeaderboard}
                className="mt-2 w-full bg-gray-500 hover:bg-gray-700 text-white py-1 px-4 rounded text-sm"
              >
                Reset Leaderboard
              </button>
            </div>
          )}
          
          {gameStarted && !gameCompleted && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-700">
              <h4 className="font-bold mb-1">Strategy Hints:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Build rapport first (ask about family)</li>
                <li>Build trust with credentials</li>
                <li>Deflect skepticism by addressing concerns</li>
                <li>Create urgency with limited-time offers</li>
                <li>Request information carefully</li>
                <li>Only ask for payment when trust is high</li>
                <li>Be careful with guarantee claims!</li>
                {(awaitingQuestion1 || awaitingQuestion2) && <li className="text-red-600 font-bold">Final verification: Answer carefully!</li>}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
