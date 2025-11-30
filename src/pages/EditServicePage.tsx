import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicesApi } from '../services/services';

const EditServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingService, setLoadingService] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await servicesApi.getCategories();
        setCategories(categoriesData);

        // Fetch service details if id exists
        if (id) {
          const serviceData = await servicesApi.getServiceById(parseInt(id));
          setFormData({
            title: serviceData.title,
            description: serviceData.description,
            price: serviceData.price.toString(),
            categoryId: serviceData.categoryId.toString(),
          });
          
          if (serviceData.imageUrl) {
            setExistingImageUrl(serviceData.imageUrl);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Échec du chargement des données du service');
      } finally {
        setLoadingService(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    if (!id) {
      setError('ID du service manquant');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('categoryId', formData.categoryId);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await servicesApi.updateService(parseInt(id), formDataToSend);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Échec de la mise à jour du service');
    } finally {
      setLoading(false);
    }
  };

  if (loadingService) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Modifier le service</h1>
      
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Image du service</label>
          {existingImageUrl && !imagePreview && (
            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-1">Image actuelle :</p>
              <img 
                src={`http://localhost:3000/${existingImageUrl}`} 
                alt="Image actuelle" 
                className="h-48 w-full object-cover rounded-md" 
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Nouvelle image :</p>
              <img src={imagePreview} alt="Preview" className="h-48 w-full object-cover rounded-md" />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditServicePage;
