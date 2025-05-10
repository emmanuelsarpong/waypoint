import heroImage from "../assets/AdobeStock_466481959.jpeg";
import howItWorksImage from "../assets/AdobeStock_495398738.jpeg";
import dashboardPreview from "../assets/dashboard-preview.jpeg";
import Button from "../components/Button";
import Card from "../components/Card";

function Homepage() {
  const bottomCards = [
    {
      id: 1,
      title: "Explore New Trails",
      image: heroImage,
      excerpt:
        "Discover the best trails near you for running, hiking, and biking.",
    },
    {
      id: 2,
      title: "Track Your Progress",
      image: dashboardPreview,
      excerpt:
        "Monitor your performance and stay motivated with detailed analytics.",
    },
    {
      id: 3,
      title: "Set Your Goals",
      image: howItWorksImage,
      excerpt:
        "Achieve your fitness milestones with personalized goal tracking.",
    },
  ];

  return (
    <div className="text-white">
      {/* Hero Section */}
      <section
        className="w-full h-[500px] flex flex-col items-center justify-center text-center px-6 mb-[200px]"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl font-extrabold mb-4">
          Track the Path. Master the Journey.
        </h1>
        <p className="text-lg text-neutral-300 mb-6 max-w-xl">
          Waypoint helps you log your outdoor runs, walks, and rides—so you can
          move with purpose.
        </p>
        <Button className="bg-white text-black px-6 py-3 rounded-md hover:bg-neutral-200">
          Get Started
        </Button>
      </section>

      {/* How It Works */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center mb-[200px]">
        <img
          src={howItWorksImage}
          alt="How it works"
          className="rounded-lg shadow-md object-cover w-full h-[300px]"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-neutral-400 mb-4">
            Log your journey with our intuitive map interface. Track your path,
            set goals, and visualize your progress in real-time.
          </p>
          <ul className="list-disc list-inside text-neutral-500 space-y-2">
            <li>Mark your running, biking, or walking paths</li>
            <li>Sync with your GPS for real-time updates</li>
            <li>Set goals and milestones</li>
          </ul>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="bg-neutral-900 w-full py-20 px-6 text-center mb-[200px]">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-bold mb-4">Beautiful Dashboard</h2>
          <p className="text-neutral-400 mb-10">
            Get insights on your performance, trends, and distances. Whether
            you're a casual jogger or a serious athlete, our analytics help you
            stay on track.
          </p>
          <img
            src={dashboardPreview}
            alt="Dashboard preview"
            className="rounded-md shadow-lg w-full h-[300px] object-cover"
          />
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-[900px] mx-auto px-6 py-20 mb-[200px]">
        <div className="bg-neutral-800 rounded-xl p-10 text-center shadow-md">
          <blockquote className="text-xl italic text-neutral-200 mb-4">
            “Waypoint changed how I plan my runs. It’s like having a personal
            trainer and map in one.”
          </blockquote>
          <p className="text-neutral-500">— Jordan M., Trail Runner</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full px-6 py-20 bg-black border-t border-neutral-800 text-center mb-[200px]">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Master Your Journey?
        </h2>
        <p className="text-neutral-400 mb-6">
          Sign up and start tracking your movement today.
        </p>
        <Button className="bg-white text-black px-6 py-3 rounded-md hover:bg-neutral-200">
          Create Account
        </Button>
      </section>

      {/* Card Layout */}
      <Card cards={bottomCards} />
    </div>
  );
}

export default Homepage;
