import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Booking } from '../services/bookings';
import { bookingsApi } from '../services/bookings';
import type { Service } from '../services/services';
import { servicesApi } from '../services/services';
import { subscriptionsApi, type Subscription } from '../services/subscriptions';
import ServiceCard from './ServiceCard';

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isProfileIncomplete = user?.role === 'PROVIDER' && (
    !user.commune || !user.neighborhood || !user.street || !user.streetNumber
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsData = await bookingsApi.getMyBookings();
        const servicesData = await servicesApi.getMyServices();
        const subscriptionData = await subscriptionsApi.getMySubscription();
        setBookings(bookingsData);
        setServices(servicesData);
        setSubscription(subscriptionData);
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
      
      {isProfileIncomplete && (
        <div className="mb-6 rounded-lg bg-yellow-50 p-4 border border-yellow-200 shadow-sm flex items-start justify-between">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Profil Incomplet</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Pour être visible sur la carte et faciliter votre localisation par les clients, merci de compléter votre adresse précise (Commune, Quartier, Avenue, N°).
              </p>
              <div className="mt-3">
                <Link
                  to="/profile"
                  className="rounded bg-yellow-600 px-4 py-2 text-sm font-bold text-white hover:bg-yellow-700"
                >
                  Compléter mon profil
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Mes Services */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-700">Mes Services</h3>
          {/* No Subscription Logic */}
          {!subscription || subscription.status !== 'ACTIVE' || new Date(subscription.endDate) < new Date() ? (
             <div className="flex items-center">
                <span className="mr-3 text-sm font-medium text-red-600">Abonnement Requis</span>
                <Link
                  to="/subscription"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  S'abonner
                </Link>
             </div>
          ) : (
             /* Active Subscription Logic */
             <>
                {/* Basic Plan Limit Check (Max 3) */}
                {subscription.plan === 'BASIC' && services.length >= 3 ? (
                    <div className="flex items-center">
                        <span className="mr-3 text-sm font-medium text-yellow-600">Limite Basic atteinte (3/3)</span>
                        <Link
                        to="/subscription"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                        Passer Premium
                        </Link>
                    </div>
                ) : (
                    <Link
                    to="/create-service"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                    + Créer un Service
                    </Link>
                )}
             </>
          )}
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                onDelete={(serviceId: number) => setServices(services.filter(s => s.id !== serviceId))}
              />
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
