import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscriptionsApi, type Subscription } from '../services/subscriptions';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'PROVIDER') {
      navigate('/');
      return;
    }

    const fetchSubscription = async () => {
      try {
        const data = await subscriptionsApi.getMySubscription();
        setSubscription(data);
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error('Failed to fetch subscription', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, navigate]);

  const handleSubscribe = async (amount: number) => {
    setSubscribing(true);
    setError('');

    try {
      const plan = amount === 10 ? 'BASIC' : 'PREMIUM';
      // Pass plan (or backend infers from amount) - updating API call
      const newSubscription = await subscriptionsApi.createSubscription(amount, plan);
      setSubscription(newSubscription);
      alert('Abonnement créé avec succès ! 🎉');
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'abonnement');
    } finally {
      setSubscribing(false);
    }
  };

  const isActive = subscription && subscription.status === 'ACTIVE' && new Date(subscription.endDate) > new Date();

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Abonnement Prestataire</h1>

      {error && <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>}

      {subscription && isActive ? (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Votre Abonnement Actuel</h2>
           <div className="grid gap-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-600">Plan :</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">
                {subscription.plan === 'BASIC' ? 'BASIC (3 Services)' : 'PREMIUM (Illimité)'}
              </span>
            </div>
             <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-600">Statut :</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">ACTIF ✓</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Date d'expiration :</span>
              <span className="font-semibold">{new Date(subscription.endDate).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          
          {subscription.plan === 'BASIC' && (
            <div className="mt-6">
                <p className="mb-4 text-sm text-gray-600">Besoin de plus de services ? Passez au plan Premium.</p>
                <button
                    onClick={() => handleSubscribe(50)}
                    disabled={subscribing}
                    className="w-full rounded bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {subscribing ? 'Traitement...' : 'Passer à Premium (50 USD)'}
                </button>
            </div>
          )}
        </div>
      ) : (
        <div>
            <h2 className="mb-4 text-xl font-bold text-gray-800">Choisissez votre formule</h2>
            <p className="mb-6 text-gray-600">Un abonnement est requis pour publier des services sur Kinhelp.</p>
            
            <div className="grid gap-6 md:grid-cols-2">
                {/* BASIC PLAN */}
                <div className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition">
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Formule Basic</h3>
                    <p className="mb-4 text-3xl font-bold text-blue-600">10 USD<span className="text-sm font-normal text-gray-500">/3 mois</span></p>
                    <ul className="mb-6 space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">✓ <span className="ml-2 font-medium">Max 3 Services</span></li>
                        <li className="flex items-center">✓ Visibilité basic</li>
                        <li className="flex items-center">✓ Support standard</li>
                    </ul>
                    <button
                        onClick={() => handleSubscribe(10)}
                        disabled={subscribing}
                        className="w-full rounded border border-blue-600 px-4 py-2 font-bold text-blue-600 hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        {subscribing ? '...' : 'Choisir Basic'}
                    </button>
                </div>

                {/* PREMIUM PLAN */}
                <div className="rounded-lg border-2 border-blue-600 bg-white p-6 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 font-bold rounded-bl">RECOMMANDÉ</div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Formule Premium</h3>
                    <p className="mb-4 text-3xl font-bold text-blue-600">50 USD<span className="text-sm font-normal text-gray-500">/3 mois</span></p>
                    <ul className="mb-6 space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">✓ <span className="ml-2 font-bold text-blue-800">Services Illimités</span></li>
                        <li className="flex items-center">✓ Visibilité maximale</li>
                        <li className="flex items-center">✓ Support prioritaire</li>
                    </ul>
                    <button
                        onClick={() => handleSubscribe(50)}
                        disabled={subscribing}
                        className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {subscribing ? '...' : 'Choisir Premium'}
                    </button>
                </div>
            </div>
            
            <p className="mt-8 text-center text-xs text-gray-500">
                * Paiement simulé pour le MVP
            </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
