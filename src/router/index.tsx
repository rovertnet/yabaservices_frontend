//-------------------------
// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BookingPage from "../pages/BookingPage";
import ChatPage from "../pages/ChatPage";
import CreateBookingPage from "../pages/CreateBookingPage";
import Dashboard from "../pages/Dashboard";


import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ServiceDetailsPage from "../pages/ServiceDetailsPage";
import ServicesPage from "../pages/ServicesPage";
import SubscriptionPage from "../pages/SubscriptionPage";


import AuthCallbackPage from "../pages/AuthCallbackPage";
import CreateServicePage from "../pages/CreateServicePage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ProfilePage from "../pages/ProfilePage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import EditServicePage from "../pages/EditServicePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Layout principal
    children: [
      { path: "", element: <Home /> },
      { path: "services", element: <ServicesPage /> },
      { path: "services/:id", element: <ServiceDetailsPage /> },
      { path: "create-service", element: <CreateServicePage /> },
      { path: "create-service", element: <CreateServicePage /> },
      { path: "booking/:id", element: <CreateBookingPage /> },
      { path: "bookings", element: <BookingPage /> },
      { path: "chat/:bookingId", element: <ChatPage /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "provider/services", element: <Dashboard /> },

      { path: "profile", element: <ProfilePage /> },
      { path: "subscription", element: <SubscriptionPage /> },
      { path: "edit-service/:id", element: <EditServicePage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
]);