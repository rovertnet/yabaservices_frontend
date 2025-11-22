//-------------------------
// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ServicesPage from "../pages/ServicesPage";
import BookingPage from "../pages/BookingPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Layout principal
    children: [
      { path: "", element: <Home /> },
      { path: "services", element: <ServicesPage /> },
      { path: "booking/:id", element: <BookingPage /> },
    ],
  },
]);