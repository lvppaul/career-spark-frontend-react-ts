import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng nhập
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blue-600 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blue-600 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex flex-wrap gap-4">
                <span>• Use 8 or more characters</span>
                <span>• Use upper and lower case letters (e.g. Aa)</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <span>• Use a number (e.g. 1234)</span>
                <span>• Use a symbol (e.g. !@#$)</span>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="flex-1 bg-blue-50 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-3">
              <img
                src="/logo_exe.jpg"
                alt="CareerSpark Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              CareerSpark
            </span>
          </div>

          {/* Main Features Title */}
          <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
            Main features
          </h2>

          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs">📊</span>
              </div>
              <p className="text-gray-700 text-sm">
                The system offers career assessments to help identify strengths
                and interests.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs">📈</span>
              </div>
              <p className="text-gray-700 text-sm">
                Progress tracking and goal setting to monitor user development.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs">📅</span>
              </div>
              <p className="text-gray-700 text-sm">
                Career event calendar with workshops, webinars, and networking
                sessions.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs">🎯</span>
              </div>
              <p className="text-gray-700 text-sm">
                Personalized career path suggestions based on user profiles and
                goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
