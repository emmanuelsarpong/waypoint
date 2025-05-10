import React from "react";

function Card() {
  const cards = [
    {
      id: 1,
      title: "Best Trails Near You",
      image: "/src/assets/AdobeStock_291368008.jpeg",
      excerpt:
        "Discover the top-rated running and hiking paths in your area, perfect for early mornings or sunset strolls.",
      author: "Waypoint Team",
      date: "May 5, 2025",
      link: "/trails",
    },
    {
      id: 2,
      title: "How to Set GPS-Based Goals",
      image: "/src/assets/AdobeStock_466481959.jpeg",
      excerpt:
        "Learn how to create realistic fitness goals that sync with your GPS route tracking on Waypoint.",
      author: "Sarah Ekow",
      date: "May 3, 2025",
      link: "/gps-goals",
    },
    {
      id: 3,
      title: "What Your Movement Says About You",
      image: "/src/assets/AdobeStock_495398738.jpeg",
      excerpt:
        "Your movement patterns reveal more than steps—they reflect stress, recovery, and rhythm. Here's how to read them.",
      author: "Dr. Kwame Opoku",
      date: "April 29, 2025",
      link: "/movement-analysis",
    },
  ];

  return (
    <section className="w-full bg-black py-20">
      <div className="flex flex-wrap gap-[25px] max-w-[1200px] mx-auto px-6 pb-12">
        {cards.map((card) => (
          <a
            key={card.id}
            href={card.link}
            className="relative flex-1 min-w-[300px] max-w-[400px] bg-neutral-900 text-white rounded-lg overflow-hidden shadow-lg flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl will-change-transform no-underline"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-[200px] object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-neutral-300 mb-4">{card.excerpt}</p>
              <p className="text-sm text-neutral-500 mt-auto">
                {card.author} • {card.date} • 3 min read
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Card;
