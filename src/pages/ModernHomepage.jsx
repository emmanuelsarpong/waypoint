import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import heroImage from "../assets/pexels-codioful-7135057.jpg";
import howItWorksImage from "../assets/pexels-codioful-7130536.jpg";
import dashboardPreview from "../assets/pexels-codioful-7130498.jpg";
import Button from "../components/Button";
import Card from "../components/Card";
import ModernHero from "../components/ModernHero";
import OptimizedImage from "../components/OptimizedImage";
import Cindy from "../assets/Cindy.jpg";
import Ife from "../assets/Ife.jpg";
import Julia from "../assets/Julia.jpg";
import Julian from "../assets/Julian.jpg";
import Maeva from "../assets/Maeva.jpg";
import Marven from "../assets/Marven.jpg";
import Trevor from "../assets/Trevor.jpg";
import Zakari from "../assets/Zakari.jpg";

// Animated Section Component
function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

function Homepage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <div ref={containerRef} className="text-white">
      {/* Modern Hero Section */}
      <ModernHero heroImage={heroImage} />

      {/* How It Works Section */}
      <AnimatedSection delay={0.2}>
        <section className="my-32">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              How Waypoint Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-neutral-400 max-w-2xl mx-auto"
            >
              Three simple steps to transform your fitness journey
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                title: "Start Moving",
                description:
                  "Begin your run, walk, or bike ride with confidence",
                image: heroImage,
              },
              {
                step: "02",
                title: "Track Progress",
                description:
                  "Monitor your routes, pace, and achievements in real-time",
                image: dashboardPreview,
              },
              {
                step: "03",
                title: "Achieve Goals",
                description:
                  "Reach new milestones and celebrate your victories",
                image: howItWorksImage,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                className="relative group"
              >
                <div className="bg-neutral-900 rounded-xl p-8 border border-neutral-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="text-blue-400 text-sm font-mono mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-white">
                      {item.title}
                    </h3>
                    <p className="text-neutral-400 mb-6">{item.description}</p>

                    <div className="w-full h-32 rounded-lg overflow-hidden">
                      <OptimizedImage
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection delay={0.4}>
        <section className="my-32">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
            >
              Beautiful Dashboard
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-neutral-400 max-w-2xl mx-auto"
            >
              Monitor your fitness journey with our intuitive and powerful
              dashboard
            </motion.p>
          </div>

          <motion.div
            style={{ y, opacity }}
            className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
            <div className="relative z-10 p-8 md:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                    Track Every Step of Your Journey
                  </h3>
                  <p className="text-neutral-400 mb-8 text-lg leading-relaxed">
                    From daily walks to marathon training, our dashboard
                    provides insights that matter. Visualize your progress, set
                    meaningful goals, and celebrate every milestone.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Real-time GPS tracking",
                      "Beautiful route visualization",
                      "Goal setting and progress monitoring",
                      "Performance analytics",
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span className="text-neutral-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg blur-xl" />
                  <OptimizedImage
                    src={dashboardPreview}
                    alt="Dashboard Preview"
                    className="relative z-10 w-full h-64 md:h-80 rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection delay={0.6}>
        <section className="my-32">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-neutral-400 max-w-2xl mx-auto"
            >
              Join thousands of users who have transformed their fitness journey
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <OptimizedImage
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full"
                    />
                  </div>
                  <h4 className="font-semibold text-white">
                    {testimonial.name}
                  </h4>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </AnimatedSection>

      {/* Explore More Section */}
      <AnimatedSection delay={0.8}>
        <section className="my-32">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
            >
              Start Your Journey Today
            </motion.h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {bottomCards.map((card, index) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className="group"
              >
                <Card
                  title={card.title}
                  image={card.image}
                  excerpt={card.excerpt}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection delay={1.0}>
        <section className="my-32 text-center">
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-12 md:p-16 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Fitness?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join Waypoint today and start tracking your journey with
                purpose.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="primary"
                      className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold border-0"
                    >
                      Get Started Free
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/about">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="secondary"
                      className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </AnimatedSection>
    </div>
  );
}

export default Homepage;
