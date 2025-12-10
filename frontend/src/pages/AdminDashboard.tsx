import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import AppointmentTable from "@/components/AppointmentTable";
import FeedbackChart from "@/components/FeedbackChart";
import { appointmentAPI, feedbackAPI } from "@/lib/api";
import {
  ChartBarIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/contexts/ToastContext";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isFeedbackChartOpen, setIsFeedbackChartOpen] = useState(false);

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["allAppointments"],
    queryFn: () => appointmentAPI.getAllAppointments().then((res) => res.data),
  });

  const { data: feedbacks = [], isLoading: feedbacksLoading } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: () => feedbackAPI.getAll().then((res) => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected";
    }) => appointmentAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
      showToast(
        `Appointment ${
          status === "approved" ? "approved" : "rejected"
        } successfully!`,
        "success"
      );
    },
    onError: () => {
      showToast("Failed to update appointment status", "error");
    },
  });

  const handleUpdateStatus = (id: string, status: "approved" | "rejected") => {
    updateStatusMutation.mutate({ id, status });
  };

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending"
  );
  const approvedAppointments = appointments.filter(
    (apt) => apt.status === "approved"
  );
  const rejectedAppointments = appointments.filter(
    (apt) => apt.status === "rejected"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 animate-in slide-in-from-bottom duration-500">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Monitor AI performance and manage appointments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom duration-500 delay-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {appointments.length}
                </p>
                <p className="text-sm text-gray-600">Total Appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom duration-500 delay-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {pendingAppointments.length}
                </p>
                <p className="text-sm text-gray-600">Pending Review</p>
                {pendingAppointments.length > 0 && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mt-1"></div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom duration-500 delay-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {approvedAppointments.length}
                </p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom duration-500 delay-400">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <XCircleIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {rejectedAppointments.length}
                </p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 animate-in slide-in-from-bottom duration-500 delay-500">
          <button
            onClick={() => setIsFeedbackChartOpen(!isFeedbackChartOpen)}
            className="w-full p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    AI Performance Analytics
                  </h2>
                  <p className="text-gray-600">
                    User feedback and satisfaction metrics
                  </p>
                </div>
              </div>
              {isFeedbackChartOpen ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </button>

          {isFeedbackChartOpen && (
            <div className="p-6 animate-in slide-in-from-top duration-300">
              {feedbacksLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                  <span className="ml-3 text-gray-600">
                    Loading analytics...
                  </span>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChartBarIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No feedback data yet
                  </h3>
                  <p className="text-gray-600">
                    Feedback data will appear here once users complete their
                    appointments
                  </p>
                </div>
              ) : (
                <FeedbackChart feedbacks={feedbacks} />
              )}
            </div>
          )}
        </div>

        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-bottom duration-500 delay-600">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-linear-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Appointment Management
                  </h2>
                  <p className="text-gray-600">
                    Review and manage all appointment requests
                  </p>
                </div>
              </div>
              {pendingAppointments.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 animate-pulse">
                  <span className="text-yellow-700 text-sm font-medium">
                    {pendingAppointments.length} pending review
                  </span>
                </div>
              )}
            </div>
          </div>

          {appointmentsLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
              <p className="text-gray-600 mt-4">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UsersIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                No appointments yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Appointment requests will appear here once users start booking
                through the AI assistant
              </p>
            </div>
          ) : (
            <AppointmentTable
              appointments={appointments}
              isAdmin={true}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </div>
      </main>
    </div>
  );
}
