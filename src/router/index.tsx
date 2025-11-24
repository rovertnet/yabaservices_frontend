//-------------------------
// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BookingPage from "../pages/BookingPage";
import CreateBookingPage from "../pages/CreateBookingPage";
import Dashboard from "../pages/Dashboard";

import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ServiceDetailsPage from "../pages/ServiceDetailsPage";
import ServicesPage from "../pages/ServicesPage";


import CreateServicePage from "../pages/CreateServicePage";
import ProfilePage from "../pages/ProfilePage";

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
      { path: "dashboard", element: <Dashboard /> },

      { path: "profile", element: <ProfilePage /> },
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
]);