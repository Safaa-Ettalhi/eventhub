import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  Save, 
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

const CreateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    maxParticipants: '',
    status: 'draft',
  });

  useEffect(() => {
    if (isEdit) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      const event = response.data;
      setFormData({
        title: event.title || '',
        description: event.description || '',
        location: event.location || '',
        eventDate: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
        maxParticipants: event.max_participants || '',
        status: event.status || 'draft',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
        maxParticipants: parseInt(formData.maxParticipants),
      };

      if (isEdit) {
        await api.put(`/events/${id}`, payload);
        setSuccess('Événement modifié avec succès !');
      } else {
        await api.post('/events', payload);
        setSuccess('Événement créé avec succès !');
      }

      setTimeout(() => {
        navigate('/events');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/events')}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {isEdit ? 'Modifier l\'événement' : 'Créer un événement'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEdit ? 'Modifiez les informations de l\'événement' : 'Remplissez les informations pour créer un nouvel événement'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl animate-slideIn flex items-center shadow-lg">
          <AlertCircle className="w-5 h-5 mr-3 animate-pulse" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-5 py-4 rounded-xl animate-bounce-in flex items-center shadow-lg">
          <CheckCircle2 className="w-5 h-5 mr-3 animate-pulse" />
          <span className="font-bold">{success}</span>
        </div>
      )}

      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 glass">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Titre de l'événement *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium"
              placeholder="Festival des Musiques du Monde - Fès"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium resize-none"
              placeholder="Décrivez votre événement..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Lieu *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium"
                placeholder="Fès, Place Boujloud"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date et Heure *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Participants Maximum *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Statut *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-semibold appearance-none cursor-pointer"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  {isEdit ? 'Modification...' : 'Création...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEdit ? 'Modifier l\'événement' : 'Créer l\'événement'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-5 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              <X className="w-5 h-5 mr-2 inline" />
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
