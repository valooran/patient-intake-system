import { useState } from "react";
import { feedbackAPI } from "@/lib/api";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/contexts/ToastContext";

interface Props {
  onClose: () => void;
}

export default function FeedbackModal({ onClose }: Props) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const smileys = [
    { value: 1, emoji: "😞", label: "Very Dissatisfied" },
    { value: 2, emoji: "🙁", label: "Dissatisfied" },
    { value: 3, emoji: "😐", label: "Neutral" },
    { value: 4, emoji: "🙂", label: "Satisfied" },
    { value: 5, emoji: "😊", label: "Very Satisfied" },
  ];

  const handleSubmit = async () => {
    if (rating === 0) {
      showToast("Please select a rating", "error");
      return;
    }

    setLoading(true);

    try {
      await feedbackAPI.submit({ rating, comment: comment || undefined });
      showToast("Thank you for your feedback!", "success");
      onClose();
    } catch (err) {
      showToast("Failed to submit feedback. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-black">
                Share Your Experience
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Help us improve our AI health assistant
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-4 text-center">
              How was your AI chat experience?
            </label>
            <div className="flex justify-center space-x-2">
              {smileys.map((smiley) => (
                <button
                  key={smiley.value}
                  onClick={() => setRating(smiley.value)}
                  onMouseEnter={() => setHoveredRating(smiley.value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={`p-3 rounded-lg transition-all duration-200 hover:scale-110 ${
                    (hoveredRating || rating) === smiley.value
                      ? "bg-green-50 scale-110"
                      : "hover:bg-gray-100"
                  }`}
                  aria-label={smiley.label}
                >
                  <span
                    className={`text-3xl ${
                      (hoveredRating || rating) === smiley.value
                        ? "filter-none"
                        : "grayscale opacity-50"
                    } transition-all duration-200`}
                  >
                    {smiley.emoji}
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-3">
                {smileys.find((s) => s.value === rating)?.label}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-black mb-2"
            >
              Comments (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="Tell us what you liked or how we can improve..."
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm">
              <strong>Privacy Note:</strong> Your feedback helps us improve our
              AI health assistant while maintaining your privacy.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={handleSkip}
            className="btn-secondary"
            disabled={loading}
          >
            Skip for now
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}
