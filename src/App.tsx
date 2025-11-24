import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import BookingPage from './pages/BookingPage';
import CreateServicePage from './pages/CreateServicePage';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import ServicesPage from './pages/ServicesPage';
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="create-service" element={<CreateServicePage />} />
          <Route path="services/:id" element={<ServiceDetailsPage />} />
          <Route path="bookings" element={<BookingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<div className="p-10 text-center"><h1>404 - Page non trouvée</h1><p>La route demandée n'existe pas.</p></div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
