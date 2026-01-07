import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Service } from '../services/services';
import { servicesApi } from '../services/services';
import BookingModal from './BookingModal';
import StarRating from './StarRating';

import MapModal from './MapModal';

interface ServiceCardProps {
  service: Service;
  onDelete?: (serviceId: number) => void;
  clientLocation?: { lat: number; lng: number } | null;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onDelete, clientLocation }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Check if the current user is the owner of this service
  const isOwnService = user?.id === service.provider?.id;
  const isProvider = user?.role === 'PROVIDER';
  const isClient = user?.role === 'CLIENT';

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      await servicesApi.deleteService(service.id);
      if (onDelete) {
        onDelete(service.id);
      }
    } catch (error) {
      console.error('Failed to delete service', error);
      alert('Échec de la suppression du service');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-service/${service.id}`);
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
        {/* Service Image */}
        <div className="h-48 w-full bg-gray-300 object-cover">
          <img
            src={service.imageUrl ? `http://localhost:3000/uploads/${service.imageUrl}` : `https://placehold.co/600x400?text=${encodeURIComponent(service.title)}`}
            alt={service.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              {service.category?.name || 'Service'}
            </span>
            <span className="text-lg font-bold text-gray-900">${service.price}</span>
          </div>
          <div className="mb-2">
            <StarRating bookingCount={service._count?.bookings || 0} size="sm" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-800">{service.title}</h3>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">{service.description}</p>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                {service.provider?.name?.charAt(0) || 'P'}
              </div>
              <Link
                to={`/providers/${service.provider?.id}`}
                className="ml-2 text-sm text-gray-600 hover:text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {service.provider?.name || 'Provider'}
              </Link>
            </div>
            {service.distance !== undefined && service.distance !== null && (
              <div
                className="flex items-center text-xs text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors"
                onClick={() => setIsMapOpen(true)}
                title="Voir sur la carte"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                à {service.distance} km
              </div>
            )}
            <div className="flex space-x-2">
              <Link
                to={`/services/${service.id}`}
                className="rounded bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200"
              >
                Détails
              </Link>

              {/* Show booking button only for clients viewing other providers' services */}
              {isClient && !isOwnService && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Réserver
                </button>
              )}

              {/* Show edit/delete buttons for providers viewing their own services */}
              {isProvider && isOwnService && (
                <>
                  <button
                    onClick={handleEdit}
                    className="rounded bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-green-700"
                  >
                    Modifier
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceId={service.id}
        serviceTitle={service.title}
      />

      {service.provider?.latitude && service.provider?.longitude && (
        <MapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          providerLocation={{ lat: service.provider.latitude!, lng: service.provider.longitude! }}
          providerName={service.provider.name}
          providerAddress={{
            city: service.provider.city || undefined,
            commune: service.provider.commune || undefined,
            neighborhood: service.provider.neighborhood || undefined,
            street: service.provider.street || undefined,
            streetNumber: service.provider.streetNumber || undefined,
          }}
          clientLocation={clientLocation}
        />
      )}
    </>
  );
};

export default ServiceCard;

