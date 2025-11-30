import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';
import type { Service } from '../services/services';
import { servicesApi } from '../services/services';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let lat: number | undefined;
        let lng: number | undefined;

        // Request geolocation
        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            setUserLocation({ lat, lng });
            console.log('User location:', lat, lng);
          } catch (geoError) {
            console.log('Geolocation denied or failed:', geoError);
          }
        }

        const data = await servicesApi.getAllServices(lat, lng);
        setServices(data);
        setFilteredServices(data);
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let result = services;

    if (searchTerm) {
      result = result.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
        // Assuming we filter by category name for now, or we could map IDs
        // For this demo, let's just match loosely if category object exists
        result = result.filter(s => s.category?.name === categoryFilter);
    }

    setFilteredServices(result);
  }, [searchTerm, categoryFilter, services]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => {
        prev.set('search', e.target.value);
        return prev;
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Tous les Services</h1>
          {user?.role === 'PROVIDER' && (
            <Link
            to="/create-service"
            className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
              Ajouter un service
            </Link>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
            <input
                type="text"
                placeholder="Rechercher un service..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} clientLocation={userLocation} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 py-12 text-center">
            <p className="text-lg text-gray-600">Aucun service trouvé.</p>
            <button 
                onClick={() => setSearchParams({})}
                className="mt-4 font-semibold text-blue-600 hover:text-blue-800"
            >
                Effacer les filtres
            </button>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
