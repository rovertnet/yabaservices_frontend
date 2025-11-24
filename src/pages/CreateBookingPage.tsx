
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookingsApi } from '../services/bookings';
import { servicesApi, type Service } from '../services/services';

const CreateBookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const data = await servicesApi.getServiceById(+id);
        setService(data);
      } catch (err) {
        console.error('Failed to fetch service', err);
        setError('Impossible de charger les détails du service.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !date) return;

    setSubmitting(true);
    try {
      await bookingsApi.createBooking({
        serviceId: +id,
        date: new Date(date).toISOString(),
      });
      navigate('/dashboard'); // Redirect to dashboard/bookings after success
    } catch (err: any) {
      console.error('Booking failed', err);
      const errorMessage = err.response?.data?.message || 'La réservation a échoué. Veuillez réessayer.';
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!service) return <div className="p-8 text-center text-red-500">Service non trouvé</div>;

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Réserver un service</h1>
        
        <div className="mb-6 rounded-md bg-blue-50 p-4">
          <h3 className="font-bold text-blue-900">{service.title}</h3>
          <p className="text-sm text-blue-700">Prestataire: {service.provider?.name}</p>
          <p className="mt-2 font-bold text-blue-800">${service.price}</p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Date et Heure souhaitées
            </label>
            <input
              type="datetime-local"
              required
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Confirmation...' : 'Confirmer la réservation'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingPage;
