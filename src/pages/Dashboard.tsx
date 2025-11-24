import React from 'react';
import { Navigate } from 'react-router-dom';
import ClientDashboard from '../components/ClientDashboard';
import ProviderDashboard from '../components/ProviderDashboard';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
      <p className="mb-8 text-gray-600">Manage your bookings and services.</p>

      {user?.role === 'PROVIDER' ? <ProviderDashboard /> : <ClientDashboard />}
    </div>
  );
};

export default Dashboard;
