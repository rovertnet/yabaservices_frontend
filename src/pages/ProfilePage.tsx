import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { subscriptionsApi, type Subscription } from '../services/subscriptions';


const ProfilePage: React.FC = () => {
  const { user, logout, login, token } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState({

    name: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
      if (user.role === 'PROVIDER') {
        fetchSubscription();
      }
    }

  }, [user]);

  const fetchSubscription = async () => {
    try {
      const data = await subscriptionsApi.getMySubscription();
      setSubscription(data);
    } catch (err) {
      console.error('Failed to fetch subscription', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${user?.id}`);
      setProfileData(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        city: response.data.city || '',
        bio: response.data.bio || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.patch(`/users/${user?.id}`, formData);
      setProfileData(response.data);
      setIsEditing(false);
      // Update context if name or email changed
      if (token && user) {
        login(token, { ...user, name: formData.name, email: formData.email });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Veuillez vous connecter pour voir votre profil.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded bg-white px-4 py-1 text-sm font-bold text-blue-600 hover:bg-gray-100"
            >
              Modifier
            </button>
          )}
        </div>
        
        <div className="p-6">
          {error && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</div>}

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nom Complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ville / Commune</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {user.role === 'PROVIDER' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="mb-6 flex items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
                  {profileData?.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border-b pb-2">
                  <label className="block text-sm font-medium text-gray-500">Nom Complet</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{profileData?.name}</p>
                </div>

                <div className="border-b pb-2">
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{profileData?.email}</p>
                </div>

                <div className="border-b pb-2">
                  <label className="block text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{profileData?.phone || '-'}</p>
                </div>

                <div className="border-b pb-2">
                  <label className="block text-sm font-medium text-gray-500">Ville</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{profileData?.city || '-'}</p>
                </div>
              </div>

              {profileData?.role === 'PROVIDER' && (
                <>
                  <div className="border-b pb-2">
                    <label className="block text-sm font-medium text-gray-500">Bio</label>
                    <p className="mt-1 text-gray-900">{profileData?.bio || '-'}</p>
                  </div>
                  
                  <div className="border-b pb-2">
                    <label className="block text-sm font-medium text-gray-500">Abonnement</label>
                    <div className="mt-1 flex items-center justify-between">
                      <div>
                        {subscription ? (
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            subscription.status === 'ACTIVE' && new Date(subscription.endDate) > new Date()
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {subscription.status === 'ACTIVE' && new Date(subscription.endDate) > new Date()
                              ? 'ACTIF' 
                              : subscription.status}
                          </span>
                        ) : (
                          <span className="text-gray-500">Aucun abonnement</span>
                        )}
                      </div>
                      <button 
                        onClick={() => navigate('/subscription')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Gérer
                      </button>
                    </div>
                  </div>
                </>
              )}


              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-500">Rôle</label>
                <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                  {user.role === 'CLIENT' ? 'Client' : 'Prestataire'}
                </span>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleLogout}
                  className="rounded bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Se Déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
