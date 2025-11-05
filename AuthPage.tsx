import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuthAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Fun with Flags
        </h1>
        <p className="text-lg text-gray-600">
            Sign in or create an account to play
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
        <form onSubmit={handleAuthAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500 text-sm">{error}</p>}
        {message && <p className="mt-4 text-center text-green-500 text-sm">{message}</p>}
        <div className="mt-8 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null);}} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
