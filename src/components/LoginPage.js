import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Fetching the master password securely from environment variables
  // (Falling back to default 'admin123' if the variable is not yet set)
  const validPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Accept any entered username, but strictly verify the master password
    if (username.trim() !== '' && password === validPassword) {
      setError('');
      // Passes the specific username up to App.js so it appears in the Activity Log
      onLogin(username.trim()); 
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-64 h-24 bg-slate-900 text-white flex items-center justify-center text-3xl font-bold tracking-wider rounded-sm shadow-xl uppercase">
          LOGO
        </div>
        <div className="w-48 text-center text-slate-500 font-bold tracking-widest mt-1 text-xs border-t-2 border-slate-300 pt-1 uppercase">
          Inventory Manager
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">System Access</h2>
        
        {error && (
          <div className="mb-5 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-semibold rounded-xl flex items-center animate-in fade-in duration-300">
            <AlertCircle size={16} className="mr-2 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white ${
                error ? 'border-rose-300' : 'border-slate-200'
              }`}
              placeholder="Enter master password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-md hover:shadow-lg mt-4"
          >
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;