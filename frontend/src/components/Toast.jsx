import { useEffect } from "react";
import { Check, AlertCircle, X } from "./Icons";

export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`cinema-toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
      </div>
      <span className="toast-text">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
}

