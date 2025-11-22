//===============================
// PAGE DÉTAILS D'UN SERVICE AVEC RÉSERVATION
//===============================

// src/pages/ServiceDetailsPage.tsx
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const serviceDetailsData = [
  {
    id: 1,
    title: "Coiffure",
    description: "Prestations de coiffure pour hommes et femmes.",
    price: "$20",
  },
  {
    id: 2,
    title: "Mécanique",
    description: "Réparation et entretien de véhicules rapides et fiables.",
    price: "$50",
  },
  {
    id: 3,
    title: "Cours particuliers",
    description: "Cours adaptés à tous les niveaux.",
    price: "$30",
  },
  {
    id: 4,
    title: "Beauté & Spa",
    description: "Soins esthétiques et bien-être.",
    price: "$40",
  },
  {
    id: 5,
    title: "Livraison à domicile",
    description: "Livraison rapide et sécurisée.",
    price: "$10",
  },
  {
    id: 6,
    title: "Événementiel",
    description: "Organisation de fêtes et événements.",
    price: "$100",
  },
];

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const service = serviceDetailsData.find((s) => s.id === Number(id));

  if (!service) {
    return <h1 className="text-center text-2xl mt-12">Service non trouvé</h1>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-2xl p-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h1>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <p className="text-xl font-semibold mb-6">Prix : {service.price}</p>

        {/* CTA Réservation */}
        <Link
          to={`/booking/${service.id}`}
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
        >
          Réserver maintenant
        </Link>
      </motion.div>
    </div>
  );
}
