import heroImage from "../assets/pexels-codioful-7135057.jpg";
import howItWorksImage from "../assets/pexels-codioful-7130536.jpg";
import dashboardPreview from "../assets/pexels-codioful-7130498.jpg";
import Button from "../components/Button";
import Card from "../components/Card";
import Cindy from "../assets/Cindy.jpg";
import Ife from "../assets/Ife.jpg";
import Julia from "../assets/Julia.jpg";
import Julian from "../assets/Julian.jpg";
import Maeva from "../assets/Maeva.jpg";
import Marven from "../assets/Marven.jpg";
import Trevor from "../assets/Trevor.jpg";
import Zakari from "../assets/Zakari.jpg";

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

  const testimonials = [
    {
      name: "Cindy",
      image: Cindy,
      quote: "I never thought tracking my walks could be this motivating.",
    },
    {
      name: "Ife",
      image: Ife,
      quote: "Waypoint adds meaning to my daily runs. It’s a lifestyle now.",
    },
    {
      name: "Julia",
      image: Julia,
      quote: "Simple, clean, and purposeful — this is how tech should feel.",
    },
    {
      name: "Julian",
      image: Julian,
      quote: "I use Waypoint to challenge myself and it never disappoints.",
    },
    {
      name: "Maeva",
      image: Maeva,
      quote: "Waypoint holds me accountable. It’s my quiet motivator.",
    },
    {
      name: "Marven",
      image: Marven,
      quote: "I finally found a tracker that doesn’t feel like a chore.",
    },
    {
      name: "Trevor",
      image: Trevor,
      quote: "Whether I bike or run, Waypoint is always with me.",
    },
    {
      name: "Zakari",
      image: Zakari,
      quote: "Waypoint fits my pace and pushes me just enough.",
    },
  ];

  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="w-full h-[500px] relative mb-[200px] rounded-lg overflow-hidden px-6">
        <img
          src={heroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center bg-black bg-opacity-50 rounded-lg">
          <h1 className="text-4xl font-extrabold mb-4 text-white">
            Track the Path. Master the Journey.
          </h1>
          <p className="text-lg text-neutral-300 mb-6 max-w-xl">
            Waypoint helps you log your outdoor runs, walks, and rides—so you
            can move with purpose.
          </p>
          <Button className="bg-white text-black px-6 py-3 rounded-md hover:bg-neutral-200">
            Get Started
          </Button>
        </div>
      </section>

      {/* How It Works + Dashboard */}
      <section className="w-full bg-black py-20 px-6 mb-[200px]">
        <div className="flex flex-wrap gap-[25px] max-w-[1200px] mx-auto">
          {/* How It Works */}
          <div className="flex flex-col bg-neutral-900 text-white rounded-lg overflow-hidden shadow-lg p-0 flex-grow basis-[65%] min-w-[300px]">
            <div className="relative h-[250px] w-full">
              <img
                src={howItWorksImage}
                alt="How it works"
                className="absolute inset-0 w-full h-full object-cover z-[-1]"
              />
              <div className="flex items-center justify-center h-full w-full bg-black bg-opacity-50 text-center">
                <h2 className="text-3xl font-bold leading-tight">
                  How It
                  <br />
                  Works
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-neutral-400 mb-4">
                Log your journey with our intuitive map interface. Track your
                path, set goals, and visualize your progress in real-time.
              </p>
              <ul className="list-disc list-inside text-neutral-500 space-y-2 mt-6">
                <li>Mark your running, biking, or walking paths</li>
                <li>Sync with your GPS for real-time updates</li>
                <li>Set goals and milestones</li>
              </ul>
            </div>
          </div>

          {/* Beautiful Dashboard */}
          <div className="flex flex-col bg-neutral-900 text-white rounded-lg overflow-hidden shadow-lg p-0 flex-grow basis-[30%] min-w-[300px]">
            <div className="relative h-[250px] w-full">
              <img
                src={dashboardPreview}
                alt="Dashboard preview"
                className="absolute inset-0 w-full h-full object-cover z-[-1]"
              />
              <div className="flex items-center justify-center h-full w-full bg-black bg-opacity-50 text-center">
                <h2 className="text-2xl font-bold leading-tight">
                  Beautiful
                  <br />
                  Dashboard
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-neutral-400 text-left">
                Get insights on your performance, trends, and distances. Whether
                you're a casual jogger or a serious athlete, our analytics help
                you stay on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full px-6 py-20 mb-[200px] bg-neutral-900">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">
            What Our Users Are Saying
          </h2>
          <div className="flex flex-wrap justify-center gap-10">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="w-[250px] flex flex-col items-center text-center"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-[200px] h-[200px] object-cover rounded-lg mb-4"
                />
                <blockquote className="italic text-neutral-200 mb-2">
                  “{t.quote}”
                </blockquote>
                <p className="text-neutral-500">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full px-6 py-20 mb-[200px]">
        <div className="relative h-[300px] max-w-[1200px] mx-auto rounded-lg overflow-hidden">
          <img
            src={heroImage}
            alt="Call to Action"
            className="absolute inset-0 w-full h-full object-cover z-[-1]"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Master Your Journey?
            </h2>
            <p className="text-neutral-300 mb-6">
              Sign up and start tracking your movement today.
            </p>
            <Button className="bg-white text-black px-6 py-3 rounded-md hover:bg-neutral-200">
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Card Layout */}
      <Card cards={bottomCards} />
    </div>
  );
}

export default Homepage;
