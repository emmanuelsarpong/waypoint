import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function Card({ cards }) {
  // Use provided cards or fallback to default cards
  const defaultCards = [
    {
      id: 1,
      title: "Best Trails Near You",
      image: "/src/assets/AdobeStock_466481959.jpeg",
      excerpt:
        "Discover the top-rated running and hiking paths in your area, perfect for early mornings or sunset strolls.",
      author: "Waypoint Team",
      date: "May 5, 2025",
      link: "/trails",
    },
    {
      id: 2,
      title: "How to Set GPS-Based Goals",
      image: "/src/assets/pexels-kamaji-ogino-5064610.jpg",
      excerpt:
        "Learn how to create realistic fitness goals that sync with your GPS route tracking on Waypoint.",
      author: "Sarah Ekow",
      date: "May 3, 2025",
      link: "/gps-goals",
    },
    {
      id: 3,
      title: "What Your Movement Says About You",
      image: "/src/assets/AdobeStock_291368008.jpeg",
      excerpt:
        "Your movement patterns reveal more than steps—they reflect stress, recovery, and rhythm. Here's how to read them.",
      author: "Dr. Kwame Opoku",
      date: "April 29, 2025",
      link: "/movement-analysis",
    },
  ];

  const cardsToRender = cards || defaultCards;

  return (
    <section className="w-full bg-black py-12 sm:py-20">
      <div className="flex flex-wrap gap-[25px] max-w-[1200px] mx-auto px-4 sm:px-6 pb-12">
        {cardsToRender.map((card, index) => (
          <motion.a
            key={card.id}
            href={card.link || "#"}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex-1 min-w-[300px] max-w-[400px] bg-neutral-900 text-white rounded-lg overflow-hidden shadow-lg flex flex-col transform transition-transform duration-300 hover:shadow-xl will-change-transform no-underline"
          >
            <div className="relative h-[200px] w-full">
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover z-[-1]"
              />
              <div className="flex items-center justify-center h-full w-full bg-black bg-opacity-50 text-center">
                <motion.h3
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-3xl font-normal leading-tight"
                >
                  {card.title}
                </motion.h3>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col flex-1">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-sm sm:text-base text-neutral-300 mb-4"
              >
                {card.excerpt}
              </motion.p>
              {(card.author || card.date) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-sm sm:text-base text-neutral-500 mt-auto"
                >
                  {card.author && card.date
                    ? `${card.author} • ${card.date} • 3 min read`
                    : card.author || card.date}
                </motion.p>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

export default Card;
