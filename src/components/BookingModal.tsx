import React, { useState } from 'react';
import { bookingsApi } from '../services/bookings';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
  serviceTitle: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, serviceId, serviceTitle }) => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await bookingsApi.createBooking({ serviceId, date });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setDate('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Réserver : {serviceTitle}</h2>
        
        {success ? (
          <div className="rounded bg-green-100 p-4 text-center text-green-700">
            <p className="font-bold">Réservation réussie !</p>
            <p className="text-sm">Le prestataire a été notifié.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</div>}
            
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Date de la prestation
              </label>
              <input
                type="datetime-local"
                className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Envoi...' : 'Confirmer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
