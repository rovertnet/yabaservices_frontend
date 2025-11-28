import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      try {
        // Decode JWT token to get user info
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        
        // Construct user object from payload
        // Note: Ensure your backend JWT payload includes these fields
        const user = {
          id: payload.sub,
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          role: payload.role
        };

        login(token, user);
        navigate('/');
      } catch (e) {
        console.error('Failed to process token', e);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location, navigate, login]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-700">Authentification en cours...</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
