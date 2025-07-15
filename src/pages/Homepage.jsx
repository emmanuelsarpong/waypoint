/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      link: "/explore-trails",
    },
    {
      id: 2,
      title: "Track Your Progress",
      image: dashboardPreview,
      excerpt:
        "Monitor your performance and stay motivated with detailed analytics.",
      link: "/track-progress",
    },
    {
      id: 3,
      title: "Set Your Goals",
      image: howItWorksImage,
      excerpt:
        "Achieve your fitness milestones with personalized goal tracking.",
      link: "/set-goals",
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
      quote: "Waypoint adds meaning to my daily runs. It's a lifestyle now.",
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
      quote: "Waypoint holds me accountable. It's my quiet motivator.",
    },
    {
      name: "Marven",
      image: Marven,
      quote: "I finally found a tracker that doesn't feel like a chore.",
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-white"
    >
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-[500px] relative mb-[200px] rounded-lg overflow-hidden px-6"
      >
        <img
          src={heroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center bg-black bg-opacity-50 rounded-lg">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-extrabold mb-4 text-white"
          >
            Track the Path. Master the Journey.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-neutral-300 mb-6 max-w-xl"
          >
            Waypoint helps you log your outdoor runs, walks, and rides—so you
            can move with purpose.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/signup">
              <Button className="bg-white text-black px-6 py-3 rounded-md hover:bg-neutral-200">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works + Dashboard */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full bg-black py-20 px-6 mb-[200px]"
      >
        <div className="flex flex-wrap gap-[25px] max-w-[1200px] mx-auto">
          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col bg-neutral-900 text-white rounded-lg overflow-hidden shadow-lg p-0 flex-grow basis-[65%] min-w-[300px]"
          >
            <div className="relative h-[250px] w-full">
              <img
                src={howItWorksImage}
                alt="How it works"
                className="absolute inset-0 w-full h-full object-cover z-[-1]"
              />
              <div className="flex items-center justify-center h-full w-full bg-black bg-opacity-50 text-center">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold leading-tight"
                >
                  How It
                  <br />
                  Works
                </motion.h2>
              </div>
            </div>
            <div className="p-6">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-neutral-400 mb-4"
              >
                Log your journey with our intuitive map interface. Track your
                path, set goals, and visualize your progress in real-time.
              </motion.p>
              <motion.ul
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="list-disc list-inside text-neutral-500 space-y-2 mt-6"
              >
                <li>Mark your running, biking, or walking paths</li>
                <li>Sync with your GPS for real-time updates</li>
                <li>Set goals and milestones</li>
              </motion.ul>
            </div>
          </motion.div>

          {/* Interactive Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col bg-neutral-900 text-white rounded-lg overflow-hidden shadow-lg p-0 flex-grow basis-[30%] min-w-[300px]"
          >
            <div className="relative h-[250px] w-full">
              <img
                src={dashboardPreview}
                alt="Dashboard preview"
                className="absolute inset-0 w-full h-full object-cover z-[-1]"
              />
              <div className="flex items-center justify-center h-full w-full bg-black bg-opacity-50 text-center">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold leading-tight"
                >
                  Interactive
                  <br />
                  Dashboard
                </motion.h2>
              </div>
            </div>
            <div className="p-6">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-neutral-400 text-left"
              >
                Get insights on your performance, trends, and distances. Whether
                you&#39;re a casual jogger or a serious athlete, our analytics
                help you stay on track.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="w-full px-6 py-20 mb-[200px] bg-neutral-900"
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-10"
          >
            What Our Users Are Saying
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-10">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * idx }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="w-[250px] flex flex-col items-center text-center"
              >
                <motion.img
                  src={t.image}
                  alt={t.name}
                  className="w-[200px] h-[200px] object-cover rounded-lg mb-4"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                />
                <motion.blockquote
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 + 0.1 * idx }}
                  viewport={{ once: true }}
                  className="italic text-neutral-200 mb-2"
                >
                  &quot;{t.quote}&quot;
                </motion.blockquote>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + 0.1 * idx }}
                  viewport={{ once: true }}
                  className="text-neutral-500"
                >
                  — {t.name}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full px-6 py-20 mb-[200px]"
      >
        <div className="relative h-[300px] max-w-[1200px] mx-auto rounded-lg overflow-hidden">
          <img
            src={heroImage}
            alt="Call to Action"
            className="absolute inset-0 w-full h-full object-cover z-[-1]"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Ready to Master Your Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-neutral-300 mb-6"
            >
              Sign up and start tracking your movement today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/signup">
                <Button className="bg-white text-black px-6 py-3 rounded-md hover:bg-neutral-200">
                  Create Account
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Card Layout */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="mb-[100px]" // Added 100px gap before footer
      >
        <Card cards={bottomCards} />
      </motion.div>
    </motion.div>
  );
}

export default Homepage;
