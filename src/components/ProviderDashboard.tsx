import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Booking } from '../services/bookings';
import { bookingsApi } from '../services/bookings';
import type { Service } from '../services/services';
import { servicesApi } from '../services/services';

const ProviderDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsData = await bookingsApi.getMyBookings();
        const servicesData = await servicesApi.getMyServices();
        setBookings(bookingsData);
        setServices(servicesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (id: number, status: Booking['status']) => {
    try {
      await bookingsApi.updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Tableau de Bord Prestataire</h2>
      
      {/* Section Mes Services */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-700">Mes Services</h3>
          <Link
            to="/create-service"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            + Créer un Service
          </Link>
        </div>
        
        {services.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <p className="mb-3 text-gray-600">Vous n'avez pas encore créé de service.</p>
            <Link
              to="/create-service"
              className="font-semibold text-blue-600 hover:underline"
            >
              Créer votre premier service
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.id} className="overflow-hidden rounded-lg border bg-white shadow transition hover:shadow-md">
                {service.imageUrl && (
                  <img
                    src={`http://localhost:3000/${service.imageUrl}`}
                    alt={service.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <h4 className="mb-2 text-lg font-bold text-gray-900">{service.title}</h4>
                  <p className="mb-3 line-clamp-2 text-sm text-gray-600">{service.description}</p>
                  <p className="mb-4 text-xl font-bold text-blue-600">{service.price} FC</p>
                  <div className="flex gap-2">
                    <Link
                      to={`/services/${service.id}`}
                      className="flex-1 rounded bg-gray-600 px-3 py-2 text-center text-sm font-bold text-white hover:bg-gray-700"
                    >
                      Voir
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
                          servicesApi.deleteService(service.id).then(() => {
                            setServices(services.filter(s => s.id !== service.id));
                          });
                        }
                      }}
                      className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Réservations */}
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
