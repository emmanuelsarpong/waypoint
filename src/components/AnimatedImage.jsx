import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import SkeletonLoader from "./SkeletonLoader";

function AnimatedImage({
  src,
  alt,
  className = "",
  style = {},
  skeletonHeight = "200px",
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative" style={{ height: skeletonHeight }}>
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <SkeletonLoader className={className} height={skeletonHeight} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        src={src}
        alt={alt}
        className={className}
        style={{ ...style, position: "absolute", inset: 0 }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        {...props}
      />
    </div>
  );
}

export default AnimatedImage;
