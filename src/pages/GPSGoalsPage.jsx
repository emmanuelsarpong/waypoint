import React from "react";

function TrailsPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Header Section */}
      <header className="w-full bg-gray-100 py-10 shadow-sm">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Best Trails Near You</h1>
          <p className="text-gray-600">
            By <span className="font-semibold">Waypoint Team</span> • May 5, 2025
          </p>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-[800px] mx-auto px-6 py-10">
        <img
          src="/src/assets/AdobeStock_291368008.jpeg"
          alt="Best Trails Near You"
          className="rounded-lg shadow-md mb-6 w-full h-[400px] object-cover"
        />
        <p className="text-lg leading-relaxed mb-6">
          Discover the top-rated running and hiking paths in your area, perfect
          for early mornings or sunset strolls. Whether you're a seasoned
          adventurer or just looking for a peaceful escape, these trails offer
          something for everyone. From scenic mountain views to tranquil forest
          paths, there's no shortage of options to explore.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Why Trails Matter</h2>
        <p className="text-lg leading-relaxed mb-6">
          Trails are more than just paths through nature—they're gateways to
          adventure, fitness, and mental clarity. Studies show that spending
          time outdoors can reduce stress, improve mood, and boost overall
          health. By exploring trails near you, you're not just moving your
          body; you're nourishing your mind and soul. Trails also play a vital
          role in preserving local ecosystems, providing a safe haven for
          wildlife and a natural escape for people.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          For many, trails are a way to connect with their community. Local
          hiking groups, running clubs, and outdoor enthusiasts often gather on
          these paths, fostering a sense of camaraderie and shared purpose.
          Whether you're training for a marathon or simply enjoying a leisurely
          walk, trails offer a space to connect with others and with nature.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Top Trails to Explore</h2>
        <ul className="list-disc list-inside text-lg leading-relaxed mb-6">
          <li>
            <strong>Sunrise Ridge Trail:</strong> Perfect for early risers, this
            trail offers breathtaking views of the sunrise over the mountains.
            It's a moderate hike with plenty of spots to stop and take in the
            scenery.
          </li>
          <li>
            <strong>Forest Loop Path:</strong> A serene escape into the woods,
            this trail is ideal for those seeking peace and quiet. The dense
            canopy of trees provides shade and a sense of tranquility.
          </li>
          <li>
            <strong>Lakeview Trail:</strong> Stunning views of the water at
            sunset make this trail a favorite among photographers and nature
            lovers. The gentle terrain makes it accessible for all skill levels.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">Tips for Exploring Trails</h2>
        <p className="text-lg leading-relaxed mb-6">
          Before heading out, make sure you're prepared. Wear comfortable shoes
          with good grip, bring plenty of water, and pack a small snack for
          longer hikes. Always check the weather forecast and let someone know
          your plans if you're venturing out alone. Respect the environment by
          staying on marked paths and carrying out any trash you bring in.
        </p>
        <p className="text-lg leading-relaxed">
          So lace up your shoes, grab your water bottle, and hit the trails.
          Adventure awaits just around the corner! Whether you're looking for a
          challenging hike or a peaceful stroll, the trails near you are ready
          to be explored.
        </p>
      </main>

      {/* Footer Section */}
      <footer className="w-full bg-gray-100 py-6 mt-10">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Waypoint. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default TrailsPage;