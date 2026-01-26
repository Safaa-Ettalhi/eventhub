import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Confetti from '../components/Confetti';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Clock,
  Loader2,
  AlertCircle,
  User,
  UserPlus,
  Calendar,
  BarChart3,
  CheckCircle2,
  X
} from 'lucide-react';

const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationFormData, setRegistrationFormData] = useState({
    eventId: '',
    participantId: '',
    status: 'pending',
  });

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const response = await api.get('/participants', { params });
      setParticipants(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [search]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.get('/events', { params: { status: 'published' } });
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Erreur lors du chargement des événements');
    }
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  useEffect(() => {
    if (showRegistrationForm) {
      fetchEvents();
    }
  }, [showRegistrationForm, fetchEvents]);

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRegistrationLoading(true);
    setRegistrationSuccess(false);

    try {
      await api.post('/registrations', registrationFormData);
      setRegistrationSuccess(true);
      setRegistrationFormData({
        eventId: '',
        participantId: '',
        status: 'pending',
      });
      setShowRegistrationForm(false);
      setTimeout(() => setRegistrationSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création de l\'inscription');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {registrationSuccess && <Confetti show={registrationSuccess} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Participants
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Gérez tous vos participants</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowRegistrationForm(true)}
          className="flex items-center px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Inscrire à un événement
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl animate-slideIn flex items-center shadow-lg">
          <AlertCircle className="w-5 h-5 mr-3 animate-pulse" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {registrationSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-5 py-4 rounded-xl animate-bounce-in flex items-center shadow-lg">
          <CheckCircle2 className="w-5 h-5 mr-3 animate-pulse" />
          <span className="font-bold">Inscription créée avec succès !</span>
        </div>
      )}

      {showRegistrationForm && (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 glass">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Inscrire un participant à un événement
            </h2>
            <button
              onClick={() => {
                setShowRegistrationForm(false);
                setRegistrationFormData({ eventId: '', participantId: '', status: 'pending' });
                setError('');
              }}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleRegistrationSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Événement *
              </label>
              <select
                required
                value={registrationFormData.eventId}
                onChange={(e) => setRegistrationFormData({ ...registrationFormData, eventId: e.target.value })}
                className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-semibold appearance-none cursor-pointer"
              >
                <option value="">Sélectionner un événement</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {new Date(event.event_date).toLocaleDateString('fr-FR')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Participant *
              </label>
              <select
                required
                value={registrationFormData.participantId}
                onChange={(e) => setRegistrationFormData({ ...registrationFormData, participantId: e.target.value })}
                className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-semibold appearance-none cursor-pointer"
              >
                <option value="">Sélectionner un participant</option>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.full_name} ({participant.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Statut
              </label>
              <select
                value={registrationFormData.status}
                onChange={(e) => setRegistrationFormData({ ...registrationFormData, status: e.target.value })}
                className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-semibold appearance-none cursor-pointer"
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={registrationLoading}
                className="flex-1 flex items-center justify-center px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registrationLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Création...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Créer l'inscription
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRegistrationForm(false);
                  setRegistrationFormData({ eventId: '', participantId: '', status: 'pending' });
                  setError('');
                }}
                className="px-5 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full max-w-md pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium"
        />
      </div>

      {participants.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucun participant trouvé</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Liste des Participants ({participants.length})
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Téléphone
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Date d'inscription
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {participants.map((participant) => (
                  <tr
                    key={participant.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {participant.full_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{participant.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {participant.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {participant.phone || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(participant.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Participants;
