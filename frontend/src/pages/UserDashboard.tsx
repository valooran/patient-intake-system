import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import BookingModal from "@/components/BookingModal";
import FeedbackModal from "@/components/FeedbackModal";
import { appointmentAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useStore";
import type { AIConclusion } from "@/lib/types";
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const toTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [showChat, setShowChat] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [conclusion, setConclusion] = useState<AIConclusion | null>(null);
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["userAppointments"],
    queryFn: () => appointmentAPI.getUserAppointments().then((res) => res.data),
  });

  const handleConclusion = (data: AIConclusion) => {
    setConclusion(data);
    setShowBooking(true);
  };

  const handleBooked = () => {
    setShowBooking(false);
    setShowFeedback(true);
    queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Confirmed";
      case "rejected":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAskAI={() => setShowChat(true)} />

      <main
        className={`transition-all duration-300 ease-in-out ${
          showChat ? "lg:mr-[30%]" : ""
        } overflow-y-auto min-h-screen`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
              Welcome back{user ? `, ${toTitleCase(user.firstName)}` : ""}
            </h1>
            <p className="text-secondary text-base sm:text-lg">
              Here's an overview of your health appointments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {appointments.length}
                  </p>
                  <p className="text-sm text-secondary">Total Appointments</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {
                      appointments.filter((apt) => apt.status === "approved")
                        .length
                    }
                  </p>
                  <p className="text-sm text-secondary">Confirmed</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {
                      appointments.filter((apt) => apt.status === "pending")
                        .length
                    }
                  </p>
                  <p className="text-sm text-secondary">Pending</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-primary">
                Your Appointments
              </h2>
              <p className="text-secondary mt-1">
                Manage and track your healthcare appointments
              </p>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                <p className="text-secondary mt-4">
                  Loading your appointments...
                </p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-12 text-center">
                <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary mb-2">
                  No appointments yet
                </h3>
                <p className="text-secondary mb-6">
                  Start a conversation with our AI to book your first
                  appointment
                </p>
               
              </div>
            ) : (
              <div>
                {appointments.map((appointment, index) => (
                  <div
                    key={appointment._id}
                    className={`p-4 hover:bg-hover transition-colors duration-200 ${
                      index > 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="mt-0.5">
                            {getStatusIcon(appointment.status)}
                          </div>
                          <div className="flex-1">
                            <div className="mb-3">
                              <h3 className="font-medium text-primary">
                                {appointment.hospital}
                              </h3>
                            </div>

                            <div className="text-sm text-secondary space-y-2">
                              <div className="flex items-center gap-6">
                                <span>
                                  <span className="font-medium">Doctor:</span>{" "}
                                  {appointment.doctor}
                                </span>
                                {appointment.diseaseConclusion && (
                                  <span>
                                    <span className="font-medium">
                                      Condition:
                                    </span>{" "}
                                    {appointment.diseaseConclusion}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs">
                                <span className="font-medium">
                                  Date & Time:
                                </span>{" "}
                                {new Date(appointment.time).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-center ml-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === "approved"
                              ? "bg-green-50 text-green-700"
                              : appointment.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {showChat && (
        <aside className="hidden lg:block fixed right-0 top-14 bottom-0 w-[30%] border-l border-border bg-surface z-30">
          <Chatbot
            onClose={() => setShowChat(false)}
            onConclusion={handleConclusion}
          />
        </aside>
      )}

      {showChat && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
            onClick={() => setShowChat(false)}
          />

          <div className="absolute right-0 top-0 h-full w-full sm:w-[70%] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <Chatbot
              onClose={() => setShowChat(false)}
              onConclusion={handleConclusion}
            />
          </div>
        </div>
      )}

      {showBooking && conclusion && (
        <BookingModal
          conclusion={conclusion}
          onClose={() => setShowBooking(false)}
          onBooked={handleBooked}
        />
      )}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </div>
  );
}
