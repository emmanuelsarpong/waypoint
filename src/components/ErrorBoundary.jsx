import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-neutral-900 flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full bg-neutral-800 rounded-xl p-8 text-center border border-neutral-700">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
        </motion.div>

        <h2 className="text-xl font-semibold text-white mb-3">
          Something went wrong
        </h2>

        <p className="text-neutral-400 mb-6 text-sm">
          We encountered an unexpected error. Don't worry, this has been logged
          and we'll fix it soon.
        </p>

        <details className="mb-6 text-left">
          <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-400">
            Technical details
          </summary>
          <pre className="mt-2 text-xs text-red-400 bg-neutral-900 p-3 rounded overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Try again
        </motion.button>
      </div>
    </motion.div>
  );
}

function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to analytics service
        console.error("Error caught by boundary:", error, errorInfo);
        // In production, send to error tracking service like Sentry
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;
