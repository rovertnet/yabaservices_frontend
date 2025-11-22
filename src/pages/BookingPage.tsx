//===============================
// PAGE DE RÉSERVATION AVEC REACT-HOOK-FORM + ZOD + CONFIRMATION ANIMÉE
//===============================

// src/pages/BookingPage.tsx
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";

//--------------------------
// Schéma Zod
//--------------------------
const bookingSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  date: z.string().min(1, "Date requise"),
  time: z.string().min(1, "Heure requise"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({ resolver: zodResolver(bookingSchema) });

  const onSubmit = (data: BookingFormData) => {
    console.log("Réservation envoyée →", data);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      reset();
    }, 3000);
  };

  return (
    <div className="relative">
      {/* Carte de confirmation animée */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50"
        >
          Réservation confirmée ✔️
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6">Réserver le service #{id}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Votre nom"
            {...register("name")}
            className="px-4 py-2 border rounded-lg"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}

          <input
            type="email"
            placeholder="Votre email"
            {...register("email")}
            className="px-4 py-2 border rounded-lg"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          <input
            type="date"
            {...register("date")}
            className="px-4 py-2 border rounded-lg"
          />
          {errors.date && (
            <span className="text-red-500 text-sm">{errors.date.message}</span>
          )}

          <input
            type="time"
            {...register("time")}
            className="px-4 py-2 border rounded-lg"
          />
          {errors.time && (
            <span className="text-red-500 text-sm">{errors.time.message}</span>
          )}

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Confirmer la réservation
          </button>
        </form>
      </motion.div>
    </div>
  );
}
