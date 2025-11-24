import React, { useEffect, useState } from 'react';
import type { Booking } from '../services/bookings';
import { bookingsApi } from '../services/bookings';

const ProviderDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsData = await bookingsApi.getMyBookings();
        setBookings(bookingsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await bookingsApi.updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Tableau de Bord Prestataire</h2>
      
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Réservations Reçues</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-500">Aucune réservation pour le moment.</p>
        ) : (
            <div className="overflow-hidden rounded-lg border bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{booking.service?.title}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{booking.client?.name}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{new Date(booking.date).toLocaleString()}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                        ${booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {booking.status === 'PENDING' && (
                            <>
                                <button onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')} className="mr-2 text-green-600 hover:text-green-900">Confirmer</button>
                                <button onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')} className="text-red-600 hover:text-red-900">Refuser</button>
                            </>
                        )}
                        {booking.status === 'CONFIRMED' && (
                             <button onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')} className="text-blue-600 hover:text-blue-900">Terminer</button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
