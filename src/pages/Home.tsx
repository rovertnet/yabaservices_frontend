import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const featuredServices = [
  { id: 1, title: "Coiffure", icon: "💇‍♀️" },
  { id: 2, title: "Mécanique", icon: "🛠️" },
  { id: 3, title: "Cours particuliers", icon: "📚" },
];

const testimonials = [
  {
    id: 1,
    name: "Alice M.",
    comment: "Une plateforme très intuitive et facile à utiliser!",
    avatar: "👩",
  },
  {
    id: 2,
    name: "Jean K.",
    comment: "J'ai trouvé un excellent prestataire en quelques minutes.",
    avatar: "👨",
  },
  {
    id: 3,
    name: "Sophie L.",
    comment: "Service fiable et rapide, je recommande fortement.",
    avatar: "👩",
  },
];

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="w-full min-h-[80vh] flex flex-col justify-center items-center text-center px-6 bg-gray-50">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 max-w-3xl"
        >
          Trouvez les meilleurs prestataires de services à Kinshasa
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl"
        >
          Réservez facilement artisans, techniciens et professionnels fiables
          depuis votre téléphone ou ordinateur.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex gap-4"
        >
          <Link
            to="/services"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all"
          >
            Voir les services
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 rounded-xl border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-all"
          >
            Devenir prestataire
          </Link>
        </motion.div>
      </section>

      <section className="w-full py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Nos Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl shadow-md bg-white flex flex-col items-center justify-center hover:scale-105 transition-transform"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <Link
                  to={`/services`}
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  Voir tous les services
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section className="w-full py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Pourquoi utiliser notre plateforme ?
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl shadow-md bg-gray-50"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Simple & Rapide
              </h3>
              <p className="mt-2 text-gray-600">
                Réservez un service en moins de 2 minutes, sans appel et sans
                complications.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl shadow-md bg-gray-50"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Prestataires Vérifiés
              </h3>
              <p className="mt-2 text-gray-600">
                Chaque artisan est validé manuellement pour garantir qualité et
                sécurité.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl shadow-md bg-gray-50"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Paiement Sécurisé
              </h3>
              <p className="mt-2 text-gray-600">
                Payez en toute sécurité et ne déboursez que lorsque le service
                est accompli.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-6 bg-blue-600 text-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold"
        >
          Prêt à trouver un prestataire fiable ?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/services"
            className="mt-6 inline-block px-8 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all"
          >
            Explorer les services
          </Link>
        </motion.div>
      </section>

      <section className="w-full py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Témoignages</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testi, index) => (
              <motion.div
                key={testi.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl shadow-md bg-gray-50 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
              >
                <div className="text-5xl mb-4">{testi.avatar}</div>
                <p className="text-gray-600 mb-4">"{testi.comment}"</p>
                <h3 className="font-semibold text-gray-800">{testi.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}