//========================================
// src/layouts/MainLayout.tsx — Version améliorée
//========================================
import { motion } from "framer-motion";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import NotificationDropdown from "../components/NotificationDropdown";
import { useAuth } from "../context/AuthContext";

import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            <img src="../../public/logokin.png" alt="" className="w-20" />
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-primary">
              Accueil
            </Link>
            <Link to="/services" className="hover:text-primary">
              Services
            </Link>
            <Link to="/services" className="hover:text-primary">
              Rechercher
            </Link>
            <Link to="/bookings" className="hover:text-primary">
              Mes Réservations
            </Link>

            <Link to="/profile" className="hover:text-primary">
              Profil
            </Link>
            {isAuthenticated && <NotificationDropdown />}
          </div>


          {/* Bouton Mobile */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setOpen(!open)}
          >
            <RxHamburgerMenu size={24} />
          </button>
        </div>

        {/* Menu Mobile */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="md:hidden bg-white border-t p-4 space-y-4"
          >
            <Link to="/" className="block" onClick={() => setOpen(false)}>
              Accueil
            </Link>
            <Link to="/services" className="block" onClick={() => setOpen(false)}>
              Services
            </Link>
            <Link to="/services" className="block" onClick={() => setOpen(false)}>
              Rechercher
            </Link>
            <Link to="/bookings" className="block" onClick={() => setOpen(false)}>
              Mes Réservations
            </Link>

            <Link
              to="/profile"
              className="block"
              onClick={() => setOpen(false)}
            >
              Profil
            </Link>
          </motion.div>
        )}
      </nav>

      {/* CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t mt-6 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} RovertNet — Tous droits réservés.
      </footer>
    </div>
  );
}
