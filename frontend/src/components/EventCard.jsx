import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, Sparkles, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventCard = ({ event, index = 0 }) => {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'staff';

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 shadow-lg shadow-green-500/30',
      draft: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-yellow-400 shadow-lg shadow-yellow-500/30',
      cancelled: 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400 shadow-lg shadow-red-500/30',
    };
    return styles[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-500 card-hover stagger-item group relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1 pr-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {event.title}
          </h3>
          <span className={`px-3 py-1.5 text-xs font-bold rounded-xl border ${getStatusBadge(event.status)} transform group-hover:scale-110 transition-transform badge-glow`}>
            {event.status}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {event.description || 'Aucune description'}
        </p>
        
        <div className="space-y-3 text-sm mb-6">
          <div className="flex items-center text-gray-600 dark:text-gray-400 group/item">
            <div className="p-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3 group-hover/item:bg-primary-200 dark:group-hover/item:bg-primary-900/50 transition-colors">
              <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="truncate font-medium">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 group/item">
            <div className="p-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3 group-hover/item:bg-primary-200 dark:group-hover/item:bg-primary-900/50 transition-colors">
              <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="font-medium">{formatDate(event.event_date)}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 group/item">
            <div className="p-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3 group-hover/item:bg-primary-200 dark:group-hover/item:bg-primary-900/50 transition-colors">
              <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="font-medium">{event.max_participants} participants max</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/events/${event.id}`}
            className="flex-1 flex items-center justify-center py-2.5 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/btn relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Voir détails
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </span>
            <Sparkles className="absolute right-4 w-4 h-4 text-white/50 group-hover/btn:text-white group-hover/btn:animate-pulse" />
          </Link>
          {canEdit && (
            <Link
              to={`/events/${event.id}/edit`}
              className="flex items-center justify-center py-2.5 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all duration-300 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-1 hover:bg-gray-200 dark:hover:bg-slate-600"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
