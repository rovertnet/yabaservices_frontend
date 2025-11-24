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

  const handleSubscribe = async () => {
    setSubscribing(true);
    setError('');

    try {
      const newSubscription = await subscriptionsApi.createSubscription(30);
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

      {subscription ? (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Statut de l'abonnement</h2>
          
          <div className="grid gap-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-600">Statut :</span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {isActive ? 'ACTIF ✓' : subscription.status}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Date de début :</span>
              <span className="font-semibold">{new Date(subscription.startDate).toLocaleDateString('fr-FR')}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Date d'expiration :</span>
              <span className="font-semibold">{new Date(subscription.endDate).toLocaleDateString('fr-FR')}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Montant :</span>
              <span className="font-semibold">${subscription.amount}</span>
            </div>
          </div>

          {!isActive && (
            <div className="mt-6">
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="w-full rounded bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
              >
                {subscribing ? 'Renouvellement...' : 'Renouveler l\'abonnement (30 USD)'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Aucun abonnement actif</h2>
          <p className="mb-6 text-gray-600">
            Pour créer des services sur Kinhelp, vous devez souscrire à un abonnement de 3 mois.
          </p>

          <div className="mb-6 rounded bg-blue-50 p-4">
            <h3 className="mb-2 font-bold text-blue-900">Plan Prestataire</h3>
            <p className="mb-1 text-sm text-blue-700">✓ Créer des services illimités</p>
            <p className="mb-1 text-sm text-blue-700">✓ Recevoir des réservations</p>
            <p className="mb-1 text-sm text-blue-700">✓ Chat avec les clients</p>
            <p className="mb-3 text-sm text-blue-700">✓ Durée : 3 mois</p>
            <p className="text-2xl font-bold text-blue-900">30 USD</p>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={subscribing}
            className="w-full rounded bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {subscribing ? 'Création de l\'abonnement...' : 'S\'abonner maintenant (30 USD)'}
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            * Paiement simulé pour le MVP - Pas de frais réels
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
