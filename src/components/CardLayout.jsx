function CardLayout() {
  const cards = [
    { id: 1, title: "Card Title 1", image: "/src/assets/AdobeStock_291368008.jpeg" },
    { id: 2, title: "Card Title 2", image: "/src/assets/AdobeStock_466481959.jpeg" },
    { id: 3, title: "Card Title 3", image: "/src/assets/AdobeStock_495398738.jpeg" },
  ];

  return (
    <section className="flex flex-wrap gap-6 px-6 py-20 bg-black">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-neutral-900 text-white rounded-lg overflow-hidden w-[300px] shadow-lg"
        >
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-[200px] object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
            <p className="text-sm text-neutral-400">Author • Date • 3 min read</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default CardLayout;