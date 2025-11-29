import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';
import type { Service } from '../services/services';
import { servicesApi } from '../services/services';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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
        // Take first 3 as featured
        setFeaturedServices(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <div className="relative mb-12 rounded-2xl bg-blue-600 px-6 py-16 text-center text-white shadow-xl sm:px-12 sm:py-24">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Trouvez l'aide qu'il vous faut, <br />
          <span className="text-blue-200">Quand vous en avez besoin.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100 sm:text-xl">
          Connectez-vous avec des professionnels de confiance pour le nettoyage, les réparations, la plomberie et plus encore à Kinshasa.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/services"
            className="rounded-full bg-white px-8 py-3 text-base font-bold text-blue-600 shadow-lg transition hover:bg-blue-50"
          >
            Voir les Services
          </Link>
          {!user ? (
            <Link
              to="/register"
              className="rounded-full border-2 border-white bg-transparent px-8 py-3 text-base font-bold text-white transition hover:bg-white/10"
            >
              Devenir Prestataire
            </Link>
          ) : user.role === 'CLIENT' ? (
            <Link
              to="/dashboard"
              className="rounded-full border-2 border-white bg-transparent px-8 py-3 text-base font-bold text-white transition hover:bg-white/10"
            >
              Mon Dashboard
            </Link>
          ) : (
            <Link
              to="/provider/services"
              className="rounded-full border-2 border-white bg-transparent px-8 py-3 text-base font-bold text-white transition hover:bg-white/10"
            >
              Mes Services
            </Link>
          )}
        </div>
      </div>

      {/* FEATURED SERVICES */}
      <div className="mb-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Services Populaires</h2>
            <p className="mt-2 text-gray-600">Les mieux notés par la communauté</p>
          </div>
          <Link to="/services" className="hidden text-sm font-semibold text-blue-600 hover:text-blue-800 sm:block">
            Tout voir &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                clientLocation={userLocation}
              />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center sm:hidden">
            <Link to="/services" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                Tout voir &rarr;
            </Link>
        </div>
      </div>

      {/* CATEGORIES (Static for now) */}
      <div className="mb-12">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">Explorer par Catégorie</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {['Plomberie', 'Nettoyage', 'Électricité', 'Déménagement', 'Peinture', 'Réparations'].map((cat) => (
                <Link key={cat} to={`/services?category=${cat}`} className="flex flex-col items-center justify-center rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md hover:bg-gray-50">
                    <div className="mb-3 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        {/* Icon placeholder */}
                        <span className="text-xl font-bold">{cat[0]}</span>
                    </div>
                    <span className="font-medium text-gray-700">{cat}</span>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;