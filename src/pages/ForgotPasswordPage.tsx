import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/auth';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Mot de passe oublié</h2>
        
        {message ? (
          <div className="rounded bg-green-100 p-4 text-center text-green-700">
            <p className="mb-4">{message}</p>
            <Link to="/login" className="font-bold text-blue-500 hover:text-blue-800">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-center text-gray-600">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
            
            {error && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  className={`focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi...' : 'Envoyer le lien'}
                </button>
                <Link to="/login" className="inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800">
                  Annuler
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
