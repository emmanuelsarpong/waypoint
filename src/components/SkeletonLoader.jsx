import { motion } from "framer-motion";

function SkeletonLoader({ className = "", width = "100%", height = "200px" }) {
  return (
    <motion.div
      className={`bg-neutral-800 rounded-lg ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default SkeletonLoader;
