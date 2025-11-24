import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Booking } from '../services/bookings';
import { bookingsApi } from '../services/bookings';

const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsApi.getAllBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: number, status: Booking['status']) => {
    try {
      await bookingsApi.updateBookingStatus(id, status);
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Mes Réservations</h1>

      {bookings.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-600">
          Aucune réservation trouvée.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {booking.service?.title || 'Service supprimé'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(booking.date).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user?.role === 'CLIENT' ? (
                      <>Prestataire: {booking.provider?.name}</>
                    ) : (
                      <>Client: {booking.client?.name}</>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>

                  {user?.role === 'PROVIDER' && booking.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                        className="rounded bg-green-500 px-3 py-1 text-sm font-bold text-white hover:bg-green-600"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                        className="rounded bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
                      >
                        Refuser
                      </button>
                    </div>
                  )}

                  {user?.role === 'PROVIDER' && booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                      className="rounded bg-blue-500 px-3 py-1 text-sm font-bold text-white hover:bg-blue-600"
                    >
                      Terminer
                    </button>
                  )}

                  {user?.role === 'CLIENT' && booking.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                      className="rounded bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
