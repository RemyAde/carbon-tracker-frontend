import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Leaf, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(email, password);
      } else {
        await authService.register(email, password);
        await authService.login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-earth-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-earth-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-earth-500 to-earth-600 rounded-2xl mb-4 shadow-lg shadow-earth-500/30">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-carbon-900 mb-2">
            Carbon Tracker
          </h1>
          <p className="text-carbon-600">
            Track your daily footprint, make a difference
          </p>
        </div>

        {/* Auth Form */}
        <div className="card animate-slide-up">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-earth-600 text-white shadow-lg'
                  : 'bg-carbon-50 text-carbon-600 hover:bg-carbon-100'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-earth-600 text-white shadow-lg'
                  : 'bg-carbon-50 text-carbon-600 hover:bg-carbon-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-carbon-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Loading...'
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {!isLogin && (
            <p className="mt-4 text-xs text-carbon-500 text-center">
              By signing up, you agree to track your carbon footprint responsibly
            </p>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up animate-delay-200">
          <div className="text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-carbon-600">Track Activities</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📈</div>
            <p className="text-xs text-carbon-600">View Analytics</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🌱</div>
            <p className="text-xs text-carbon-600">Reduce Impact</p>
          </div>
        </div>
      </div>
    </div>
  );
}