import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock3,
  XCircle,
  Mail,
  Edit,
  TrendingUp
} from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const canEdit = user?.role === 'admin' || user?.role === 'staff';

  useEffect(() => {
    fetchEvent();
    fetchRegistrations();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/registrations', { params: { eventId: id } });
      setRegistrations(response.data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
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

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return styles[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  };

  const getEventStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800',
      draft: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return styles[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle2;
      case 'pending':
        return Clock3;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="inline-block animate-spin h-12 w-12 text-primary-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <div className="text-red-600 dark:text-red-400 mb-4 text-lg">{error || 'Événement non trouvé'}</div>
        <Link
          to="/events"
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Link>
      </div>
    );
  }

  const confirmedCount = registrations.filter(r => r.status === 'confirmed' || r.status === 'pending').length;
  const fillPercentage = event.max_participants > 0 ? Math.round((confirmedCount / event.max_participants) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour à la liste
        </Link>
        {canEdit && (
          <Link
            to={`/events/${id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Link>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
            <span className={`px-3 py-1.5 text-sm font-semibold rounded-md border ${getEventStatusBadge(event.status)}`}>
              {event.status}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Description
              </h3>
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{event.description || 'Aucune description'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Lieu</h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">{event.location}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Date et Heure</h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(event.event_date)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Participants</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {confirmedCount} / {event.max_participants}
                  </p>
                  <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2 ml-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        fillPercentage >= 80 ? 'bg-red-500' :
                        fillPercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{fillPercentage}%</span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Créé le</h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(event.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inscriptions ({registrations.length})
              </h2>
            </div>
            {canEdit && (
              <Link
                to="/register"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
              >
                + Nouvelle inscription
              </Link>
            )}
          </div>
        </div>
        <div className="p-6">
          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Aucune inscription pour cet événement</p>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg) => {
                const StatusIcon = getStatusIcon(reg.status);
                return (
                  <div
                    key={reg.id}
                    className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {reg.participant_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{reg.participant_name}</h3>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 truncate">
                            <Mail className="w-3 h-3 mr-1" />
                            {reg.participant_email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="w-4 h-4 text-gray-400" />
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${getStatusBadge(reg.status)}`}>
                            {reg.status}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(reg.created_at)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
