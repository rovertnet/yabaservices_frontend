import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Service } from '../services/services';
import { servicesApi } from '../services/services';

const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const data = await servicesApi.getServiceById(+id);
        setService(data);
      } catch (error) {
        console.error('Failed to fetch service details', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Service non trouvé</h2>
        <Link to="/services" className="mt-4 inline-block text-blue-600 hover:underline">
          Retour aux Services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/services" className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600">
        &larr; Retour aux Services
      </Link>

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="h-64 w-full bg-gray-300 sm:h-80">
             <img 
                src={`https://placehold.co/800x400?text=${encodeURIComponent(service.title)}`} 
                alt={service.title}
                className="h-full w-full object-cover"
             />
        </div>
        
        <div className="p-8">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-800">
                        {service.category?.name || 'Catégorie'}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                    <div className="mt-2 flex items-center text-gray-600">
                        <span className="mr-2">Par</span>
                        <span className="font-semibold text-gray-800">{service.provider?.name || 'Prestataire Inconnu'}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">${service.price}</p>
                    <p className="text-sm text-gray-500">par session</p>
                </div>
            </div>

            <div className="my-8 border-t border-b border-gray-100 py-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Description</h2>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {service.description}
                </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        Publié le {new Date(service.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <button
                    onClick={handleBookNow}
                    className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Réserver ce service
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
