import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

const iconMap = {
  success: (
    <CheckCircle className="w-12 h-12 text-green-500 animate-icon-success" />
  ),
  warning: (
    <AlertTriangle className="w-12 h-12 text-yellow-500 animate-icon-warning" />
  ),
  error: <AlertCircle className="w-12 h-12 text-red-500 animate-icon-error" />,
  info: <Info className="w-12 h-12 text-blue-500 animate-icon-info" />,
};

const NotificationPartial = ({
  type = "info",
  title,
  message,
  isOpen,
  onClose,
  duration = 2000,
}) => {
  // Auto-close sau duration ms
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Content area with stronger blur effect and entrance animation */}
      <div className="relative w-full max-w-md p-6 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl animate-notification-enter">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Icon with animation */}
          <div className="mb-4 transform transition-transform">
            {iconMap[type]}
          </div>

          {/* Title with subtle animation */}
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white animate-title-enter">
            {title}
          </h3>

          {/* Message with fade-in animation */}
          <p className="text-gray-600 dark:text-gray-300 animate-message-enter">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPartial;
