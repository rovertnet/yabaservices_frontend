import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerLocation: { lat: number; lng: number };
  providerName: string;
  clientLocation?: { lat: number; lng: number } | null;
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, providerLocation, providerName, clientLocation }) => {
  if (!isOpen) return null;

  // Calculate center between points if client location exists
  const center: [number, number] = clientLocation 
    ? [
        (providerLocation.lat + clientLocation.lat) / 2,
        (providerLocation.lng + clientLocation.lng) / 2
      ]
    : [providerLocation.lat, providerLocation.lng];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">Localisation de {providerName}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer 
            center={center} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Provider Marker */}
            <Marker position={[providerLocation.lat, providerLocation.lng]}>
              <Popup>
                <div className="font-bold text-blue-600">Prestataire: {providerName}</div>
              </Popup>
            </Marker>

            {/* Client Marker (if available) */}
            {clientLocation && (
              <Marker position={[clientLocation.lat, clientLocation.lng]}>
                <Popup>
                  <div className="font-bold text-green-600">Votre position</div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 border-t">
            Utilisez la molette pour zoomer et glisser pour vous déplacer.
        </div>
      </div>
    </div>
  );
};

export default MapModal;
