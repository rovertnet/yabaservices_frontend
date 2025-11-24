import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesApi } from '../services/services';

const CreateServicePage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await servicesApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.categoryId) {
      setError('Veuillez sélectionner une catégorie');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
      };
      console.log('Sending payload:', payload);
      await servicesApi.createService(payload);
      navigate('/services');
    } catch (err: any) {
      console.error('Creation error:', err);
      setError(err.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Créer un nouveau service</h1>
      
      {error && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre du service</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Ex: Réparation fuite d'eau"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Catégorie</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Décrivez votre service en détail..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prix (USD)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="0.00"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Création...' : 'Créer le service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateServicePage;
