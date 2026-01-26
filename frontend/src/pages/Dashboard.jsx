import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Trophy, 
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des statistiques..." />;
  }

  if (error) {
    return (
      <div className="text-center py-16 animate-bounce-in">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <div className="text-red-600 dark:text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Événements',
      value: stats?.totalEvents || 0,
      icon: Calendar,
      gradient: 'from-primary-500 via-primary-600 to-primary-700',
      bgGradient: 'from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20',
    },
    {
      title: 'Événements Publiés',
      value: stats?.publishedEvents || 0,
      icon: CheckCircle2,
      gradient: 'from-green-500 via-emerald-600 to-teal-600',
      bgGradient: 'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20',
    },
    {
      title: 'Inscriptions Aujourd\'hui',
      value: stats?.todayRegistrations || 0,
      icon: FileText,
      gradient: 'from-blue-500 via-cyan-600 to-sky-600',
      bgGradient: 'from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-800/20',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="relative">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-pulse" />
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Vue d'ensemble de vos événements</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 card-hover stagger-item`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className={`text-5xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent animate-gradient`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-2xl shadow-xl transform hover:scale-110 transition-transform duration-300 animate-float`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="h-1 bg-white/30 dark:bg-slate-700/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full animate-gradient`}
                  style={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden glass">
        <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Top 5 Événements les Plus Remplis
            </h2>
          </div>
        </div>
        <div className="p-6">
          {stats?.topEvents && stats.topEvents.length > 0 ? (
            <div className="space-y-4">
              {stats.topEvents.map((event, index) => {
                const percentage = Math.min(event.fill_percentage || 0, 100);
                const getColor = () => {
                  if (percentage >= 80) return { 
                    bg: 'bg-gradient-to-r from-red-500 to-rose-600', 
                    text: 'text-red-600 dark:text-red-400',
                    badge: 'from-red-500 to-rose-600'
                  };
                  if (percentage >= 50) return { 
                    bg: 'bg-gradient-to-r from-yellow-500 to-amber-600', 
                    text: 'text-yellow-600 dark:text-yellow-400',
                    badge: 'from-yellow-500 to-amber-600'
                  };
                  return { 
                    bg: 'bg-gradient-to-r from-green-500 to-emerald-600', 
                    text: 'text-green-600 dark:text-green-400',
                    badge: 'from-green-500 to-emerald-600'
                  };
                };
                const colors = getColor();
                return (
                  <div
                    key={event.id}
                    className="bg-gradient-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 stagger-item card-hover"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${colors.badge} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transform hover:rotate-12 transition-transform`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{event.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.current_count} / {event.max_participants} participants
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-6 h-6 text-gray-400 animate-pulse" />
                        <div className={`text-2xl font-extrabold ${colors.text} animate-bounce-in`}>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${colors.bg} rounded-full transition-all duration-1000 ease-out relative`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-float" />
              <p className="text-gray-500 dark:text-gray-400">Aucun événement publié</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
