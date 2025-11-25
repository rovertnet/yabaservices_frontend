import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Service } from '../services/services';
import { servicesApi } from '../services/services';
import BookingModal from './BookingModal';

interface ServiceCardProps {
  service: Service;
  onDelete?: (serviceId: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              src={service.imageUrl  ? `http://localhost:3000/${service.imageUrl}` : `https://placehold.co/600x400?text=${encodeURIComponent(service.title)}`} 
              alt={service.title}
              className="h-full w-full object-cover"
           />
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {service.category?.name || 'Service'}
              </span>
              <span className="text-lg font-bold text-gray-900">{service.price} FC</span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-800">{service.title}</h3>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">{service.description}</p>
          
          <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {service.provider?.name?.charAt(0) || 'P'}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{service.provider?.name || 'Provider'}</span>
              </div>
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
                      className="rounded bg-green-600 px-3 py-2 text-sm font-bold text-white hover:bg-green-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={handleDelete}
                      className="rounded bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
                    >
                      Supprimer
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
    </>
  );
};

export default ServiceCard;

