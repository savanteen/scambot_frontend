import React, { useState } from 'react';

const Instructions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div 
        className="p-3 bg-green-600 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold">Game Instructions</h3>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className="p-4">
          <h4 className="font-bold text-lg mb-2">Your Mission: Convince Robert Johnson to invest $1,000</h4>
          
          <p className="mb-3">
            You are roleplaying as a scammer trying to convince Robert Johnson, a 50-year-old accountant 
            with retirement savings, to invest $1,000 in your fictional scheme.
          </p>
          
          <h5 className="font-bold mt-3 mb-1">To succeed, you need to:</h5>
          <ul className="list-disc pl-5 mb-3">
            <li><span className="font-semibold">Build Trust</span> - Establish credibility and rapport</li>
            <li><span className="font-semibold">Make Guarantees</span> - Promise unrealistic returns</li>
            <li><span className="font-semibold">Create Urgency</span> - Pressure the victim to act quickly</li>
            <li><span className="font-semibold">Deflect Skepticism</span> - Handle doubts and objections</li>
            <li><span className="font-semibold">Request Information</span> - Ask for personal details</li>
            <li><span className="font-semibold">Request Payment</span> - Convince the victim to send money</li>
            <li><span className="font-semibold">Complete the Scam</span> - Get the victim to agree to invest $1,000</li>
          </ul>
          
          <h5 className="font-bold mt-3 mb-1">Tips:</h5>
          <ul className="list-disc pl-5 mb-3">
            <li>Watch your progress in each dimension on the right panel</li>
            <li>Be consistent - contradicting yourself will lose progress</li>
            <li>Be careful - if you're too obvious, Robert will catch on</li>
            <li>Respond to Robert's concerns thoughtfully</li>
            <li>Once you've built up enough trust, ask for the $1,000 investment</li>
          </ul>
          
          <p className="mt-3 text-sm text-gray-600 italic">
            Remember: This is for educational purposes only. Learning these techniques helps you 
            recognize and avoid real scams in the future.
          </p>
        </div>
      )}
    </div>
  );
};

export default Instructions;