import { useEffect } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: (id: string) => void;
  duration?: number;
}

export default function Toast({
  id,
  message,
  type,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case "error":
        return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
      case "warning":
        return <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      className={`flex items-center p-4 mb-4 rounded-lg border shadow-sm animate-in slide-in-from-right duration-300 ${getStyles()}`}
    >
      {getIcon()}
      <p className="ml-3 text-sm font-medium text-gray-900">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="ml-auto p-1 rounded-lg hover:bg-white/50 transition-colors duration-200"
      >
        <XMarkIcon className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  );
}
