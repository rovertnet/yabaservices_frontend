
import {
  CalendarDays,
  MapPin,
  User
} from 'lucide-react'; // Using lucide-react as it is installed
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ServiceCard from '../components/ServiceCard';
import api from '../services/api'; // Assuming this is the axios instance

interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  bio: string | null;
  createdAt: string;
  services: any[]; // We can refine this type or import Service type
}

export default function ProviderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await api.get(`/providers/${id}`);
        setProvider(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load provider profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProvider();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Provider not found</h2>
        <p className="mt-2 text-gray-600">{error || 'The provider you are looking for does not exist.'}</p>
        <Link to="/services" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
          Retournez aux services 
        </Link>
      </div>
    );
  }

  // Calculate stats
  const totalServices = provider.services.length;
  // Calculate average rating across all services
  const allRatings = provider.services.flatMap(s => s.reviews.map((r: any) => r.rating));
  const avgRating = allRatings.length > 0 
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) 
    : 'New';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100">
          <div className="md:flex items-start justify-between">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold uppercase">
                {provider.name.charAt(0)}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-gray-900">{provider.name}</h1>
                <div className="flex items-center text-gray-500 mt-1">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">Prestataire</span>
                  {provider.city && (
                    <div className="flex items-center mr-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{provider.city}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>Réjoint {new Date(provider.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <span className="block text-xl font-bold text-gray-900">{totalServices}</span>
                  <span className="text-gray-500">Services</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold text-yellow-500">{avgRating}</span>
                  <span className="text-gray-500">Rating</span>
                </div>
              </div>
            </div>
          </div>

          {provider.bio && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">A propos</h3>
              <p className="text-gray-600">{provider.bio}</p>
            </div>
          )}
          
          <div className="mt-6 flex space-x-4">
             {/* Contact options could go here if we want to expose email or message button */}
             {/* Currently exposing email might be too much, leaving it as just display or contact form future */}
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Services de {provider.name}</h2>
          
          {provider.services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {provider.services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">This provider hasn't listed any services yet.</p>
            </div>
          )}
        </div>
    </div>
  );
}
