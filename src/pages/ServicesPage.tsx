//===============================
// PAGE SERVICES AVEC CARTES ANIMÉES ET CTA
//===============================

// src/pages/ServicesPage.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const servicesData = [
  {
    id: 1,
    title: "Coiffure",
    description: "Coiffeurs professionnels à Kinshasa",
    icon: "💇‍♂️",
  },
  {
    id: 2,
    title: "Mécanique",
    description: "Réparation auto rapide et fiable",
    icon: "🛠️",
  },
  {
    id: 3,
    title: "Cours particuliers",
    description: "Professeurs qualifiés pour tous niveaux",
    icon: "📚",
  },
  {
    id: 4,
    title: "Beauté & Spa",
    description: "Soins esthétiques et bien-être",
    icon: "💅",
  },
  {
    id: 5,
    title: "Livraison à domicile",
    description: "Services de livraison rapides et sûrs",
    icon: "📦",
  },
  {
    id: 6,
    title: "Événementiel",
    description: "Organisation de fêtes et événements",
    icon: "🎉",
  },
];

export default function ServicesPage() {
  return (
    <div className="w-full px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Nos Services Populaires
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {servicesData.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-6 rounded-2xl shadow-md bg-white flex flex-col items-center text-center hover:scale-105 transition-transform"
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
            <Link
              to={`/service/${service.id}`}
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              Voir Détails
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <section className="mt-16 py-12 bg-blue-600 text-white rounded-2xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Vous souhaitez proposer un service ?
        </h2>
        <p className="mb-6">
          Rejoignez notre plateforme et atteignez de nouveaux clients
          facilement.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all"
        >
          Devenir Prestataire
        </Link>
      </section>
    </div>
  );
}
