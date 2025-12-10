import type { Appointment } from "@/lib/types";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const toTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

interface Props {
  appointments: Appointment[];
  isAdmin: boolean;
  onUpdateStatus?: (id: string, status: "approved" | "rejected") => void;
}

export default function AppointmentTable({
  appointments,
  isAdmin,
  onUpdateStatus,
}: Props) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment._id}
          className="card p-6 hover:shadow-medium transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(appointment.status)}
                  <h3 className="font-semibold text-primary">
                    {toTitleCase(appointment.userId.firstName)}{" "}
                    {toTitleCase(appointment.userId.lastName)}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>
                {isAdmin &&
                  onUpdateStatus &&
                  appointment.status === "pending" && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() =>
                          onUpdateStatus(appointment._id, "approved")
                        }
                        className="btn-primary text-xs sm:text-sm px-3 py-1.5 cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          onUpdateStatus(appointment._id, "rejected")
                        }
                        className="btn-secondary text-xs sm:text-sm px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-secondary">Doctor</p>
                  <p className="text-sm font-medium text-primary">
                    {appointment.doctor}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-secondary">Date & Time</p>
                  <p className="text-sm font-medium text-primary">
                    {new Date(appointment.time).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-secondary">Hospital</p>
                  <p className="text-sm font-medium text-primary">
                    {appointment.hospital}
                  </p>
                </div>
              </div>

              {(appointment.diseaseConclusion ||
                appointment.medications?.length) && (
                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {appointment.diseaseConclusion && (
                      <div>
                        <p className="text-xs text-secondary mb-1">Diagnosis</p>
                        <p className="text-sm font-medium text-primary">
                          {appointment.diseaseConclusion}
                        </p>
                        {appointment.severity && (
                          <p className="text-xs text-secondary">
                            Severity: {appointment.severity}
                          </p>
                        )}
                      </div>
                    )}
                    {appointment.medications?.length && (
                      <div>
                        <p className="text-xs text-secondary mb-1">
                          Recommended Medications
                        </p>
                        <p className="text-sm text-primary">
                          {appointment.medications.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-primary mb-2">
            No appointments found
          </h3>
          <p className="text-secondary">
            {isAdmin
              ? "No appointment requests at this time."
              : "You haven't booked any appointments yet."}
          </p>
        </div>
      )}
    </div>
  );
}
