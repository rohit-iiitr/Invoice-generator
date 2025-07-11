// JourneyPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define interface for feature card
interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  colorClass: string;
}

const JourneyPage: React.FC = () => {
  const navigate = useNavigate();

  const navigateToProducts = () => {
    navigate('/products');
  };

  const goBackToSignup = () => {
    navigate('/signup');
  };

  const features: FeatureCard[] = [
    {
      title: 'Analytics',
      description: 'Track your progress and performance',
      icon: '📊',
      colorClass: 'text-green-400',
    },
    {
      title: 'Tools',
      description: 'Access powerful features and integrations',
      icon: '🛠',
      colorClass: 'text-blue-400',
    },
    {
      title: 'Goals',
      description: 'Set and achieve your objectives',
      icon: '🎯',
      colorClass: 'text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <div className="w-48 h-48 bg-gradient-to-br from-green-400 to-blue-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
            <div className="text-white text-6xl font-bold">🚀</div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Let the Journey Begin!</h1>
          <p className="text-xl text-gray-400 mb-8">
            Welcome to your new adventure. Ready to explore what's possible?
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
            >
              <div className={`${feature.colorClass} text-3xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={navigateToProducts}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 mr-4"
          >
            Continue to Products
          </button>
          <button
            onClick={goBackToSignup}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default JourneyPage;
