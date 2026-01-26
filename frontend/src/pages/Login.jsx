import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ParticlesBackground from '../components/ParticlesBackground';
import { Calendar, Mail, Lock, AlertCircle, Key, Loader2, Moon, Sun, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-110 z-50"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="max-w-md w-full space-y-8 animate-bounce-in relative z-10">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-gray-200/50 dark:border-slate-700/50 glass">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300 animate-pulse-glow">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <h2 className="text-4xl font-extrabold gradient-text">
                EventHub
              </h2>
              <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Connectez-vous pour gérer vos événements
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl animate-slideIn flex items-center shadow-lg">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 animate-pulse" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 font-medium"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Connexion...
                </>
              ) : (
                <>
                  <span className="relative z-10">Se connecter</span>
                  <Sparkles className="absolute right-4 w-4 h-4 text-white/50 animate-pulse" />
                </>
              )}
            </button>

            <div className="mt-6 p-5 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border-2 border-primary-200 dark:border-primary-800 shadow-lg">
              <div className="flex items-center mb-3">
                <div className="p-1.5 bg-primary-600 rounded-lg mr-3">
                  <Key className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Comptes de test</p>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 ml-10 font-medium">
                <p><span className="font-bold text-primary-700 dark:text-primary-400">Admin:</span> admin@eventhub.ma / password123</p>
                <p><span className="font-bold text-primary-700 dark:text-primary-400">Staff:</span> staff@eventhub.ma / password123</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
