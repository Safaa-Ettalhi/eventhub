import { useState, useEffect } from 'react';
import api from '../services/api';
import Confetti from '../components/Confetti';
import { 
  UserPlus, 
  Calendar, 
  User, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

const RegisterParticipant = () => {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    eventId: '',
    participantId: '',
    status: 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchParticipants();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events', { params: { status: 'published' } });
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await api.get('/participants');
      setParticipants(response.data);
    } catch (err) {
      console.error('Error fetching participants:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await api.post('/registrations', formData);
      setSuccess(true);
      setFormData({
        eventId: '',
        participantId: '',
        status: 'pending',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="relative">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Inscrire un Participant
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Créez une nouvelle inscription à un événement</p>
          </div>
        </div>
      </div>

      <Confetti show={success} />

      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 max-w-3xl glass">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl mb-6 animate-slideIn flex items-center shadow-lg">
            <AlertCircle className="w-5 h-5 mr-3 animate-pulse" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-5 py-4 rounded-xl mb-6 animate-bounce-in flex items-center shadow-lg">
            <CheckCircle2 className="w-5 h-5 mr-3 animate-pulse" />
            <span className="text-sm font-bold">Inscription créée avec succès !</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="eventId" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Événement *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <select
                id="eventId"
                required
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm font-semibold"
              >
                <option value="">Sélectionner un événement</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {new Date(event.event_date).toLocaleDateString('fr-FR')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="participantId" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Participant *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <select
                id="participantId"
                required
                value={formData.participantId}
                onChange={(e) => setFormData({ ...formData, participantId: e.target.value })}
                className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm font-semibold"
              >
                <option value="">Sélectionner un participant</option>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.full_name} ({participant.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm font-semibold"
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
              </select>
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
                Création...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                <span className="relative z-10">Créer l'inscription</span>
                <Sparkles className="absolute right-4 w-4 h-4 text-white/50 animate-pulse" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterParticipant;
