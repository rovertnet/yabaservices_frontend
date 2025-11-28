import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth';

const VerifyEmailPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authService.verifyEmail({ email, code });
      const { access_token, user } = response.data;
      login(access_token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    setMessage('');
    setError('');
    try {
      await authService.resendVerificationCode(email);
      setMessage('Code renvoyé avec succès');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Vérification Email</h2>
        <p className="mb-6 text-center text-gray-600">
          Un code de vérification a été envoyé à <strong>{email}</strong>.
        </p>
        
        {error && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</div>}
        {message && <div className="mb-4 rounded bg-green-100 p-2 text-green-700">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="code">
              Code de vérification
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="code"
              type="text"
              placeholder="Entrez le code à 6 chiffres"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Vérifier
            </button>
            
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-blue-500 hover:text-blue-800 focus:outline-none"
            >
              Renvoyer le code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
