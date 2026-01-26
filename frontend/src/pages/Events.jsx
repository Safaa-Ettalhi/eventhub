import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/SkeletonCard';
import { 
  Filter,
  AlertCircle,
  Search,
  CalendarDays,
  X,
  Sparkles,
  Zap,
  Plus
} from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [statusFilter, dateFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      const response = await api.get('/events', { params });
      setEvents(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleEventDelete = (deletedEventId) => {
    setEvents(events.filter(event => event.id !== deletedEventId));
  };

  const filteredEvents = events.filter(event => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      (event.description && event.description.toLowerCase().includes(query))
    );
  });

  const clearFilters = () => {
    setStatusFilter('');
    setSearchQuery('');
    setDateFilter('');
  };

  const hasActiveFilters = statusFilter || searchQuery || dateFilter;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Événements
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Découvrez et gérez tous vos événements</p>
            </div>
          </div>
        </div>
        <Link
          to="/events/new"
          className="flex items-center px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5 mr-2" />
          Créer un événement
        </Link>
      </div>

      {/* Premium Filtres */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-xl glass">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher par titre, lieu ou description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium"
            />
          </div>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none cursor-pointer text-sm text-gray-900 dark:text-white font-semibold"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          <div className="relative group">
            <CalendarDays className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm text-gray-900 dark:text-white font-semibold"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <X className="w-4 h-4 mr-2" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl animate-slideIn flex items-center shadow-lg">
          <AlertCircle className="w-5 h-5 mr-3 animate-pulse" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-700 shadow-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full mb-6 animate-pulse">
            <CalendarDays className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {searchQuery || statusFilter || dateFilter 
              ? 'Aucun événement ne correspond à vos critères' 
              : 'Aucun événement trouvé'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || statusFilter || dateFilter 
              ? 'Essayez de modifier vos filtres de recherche' 
              : 'Commencez par créer votre premier événement'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400 animate-pulse" />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} onDelete={handleEventDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Events;
