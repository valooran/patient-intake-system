import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { appointmentAPI } from "@/lib/api";
import { AIConclusion } from "@/lib/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/contexts/ToastContext";
import CustomSelect from "./CustomSelect";

interface Props {
  conclusion: AIConclusion;
  onClose: () => void;
  onBooked: () => void;
}

export default function BookingModal({ conclusion, onClose, onBooked }: Props) {
  if (
    !conclusion ||
    !conclusion.hospitals ||
    conclusion.hospitals.length === 0
  ) {
    console.error("BookingModal: Invalid conclusion data", conclusion);
    onClose();
    return null;
  }

  const [form, setForm] = useState({
    doctor: "",
    time: new Date(),
    hospital: "",
  });

  const hospitalOptions = [
    { value: "Toronto General Hospital", label: "Toronto General Hospital" },
    {
      value: "Mount Sinai Hospital (Toronto)",
      label: "Mount Sinai Hospital (Toronto)",
    },
    {
      value: "St. Michael's Hospital (Toronto)",
      label: "St. Michael's Hospital (Toronto)",
    },
    {
      value: "Sunnybrook Health Sciences Centre",
      label: "Sunnybrook Health Sciences Centre",
    },
    { value: "Women's College Hospital", label: "Women's College Hospital" },
    {
      value: "Vancouver General Hospital",
      label: "Vancouver General Hospital",
    },
    {
      value: "St. Paul's Hospital (Vancouver)",
      label: "St. Paul's Hospital (Vancouver)",
    },
    { value: "Royal Columbian Hospital", label: "Royal Columbian Hospital" },
    { value: "Montreal General Hospital", label: "Montreal General Hospital" },
    {
      value: "McGill University Health Centre",
      label: "McGill University Health Centre",
    },
    {
      value: "Jewish General Hospital (Montreal)",
      label: "Jewish General Hospital (Montreal)",
    },
    { value: "Ottawa Hospital", label: "Ottawa Hospital" },
    {
      value: "The Ottawa Hospital - Civic Campus",
      label: "The Ottawa Hospital - Civic Campus",
    },
    {
      value: "Children's Hospital of Eastern Ontario",
      label: "Children's Hospital of Eastern Ontario",
    },
    { value: "Hamilton Health Sciences", label: "Hamilton Health Sciences" },
    {
      value: "London Health Sciences Centre",
      label: "London Health Sciences Centre",
    },
    {
      value: "Kingston Health Sciences Centre",
      label: "Kingston Health Sciences Centre",
    },
    {
      value: "Queen's University Hospital",
      label: "Queen's University Hospital",
    },
    { value: "Calgary Health Region", label: "Calgary Health Region" },
    { value: "Foothills Medical Centre", label: "Foothills Medical Centre" },
    { value: "Peter Lougheed Centre", label: "Peter Lougheed Centre" },
    {
      value: "Royal Alexandra Hospital (Edmonton)",
      label: "Royal Alexandra Hospital (Edmonton)",
    },
    {
      value: "University of Alberta Hospital",
      label: "University of Alberta Hospital",
    },
    {
      value: "Health Sciences Centre (Winnipeg)",
      label: "Health Sciences Centre (Winnipeg)",
    },
    {
      value: "St. Boniface General Hospital",
      label: "St. Boniface General Hospital",
    },
    {
      value: "QEII Health Sciences Centre (Halifax)",
      label: "QEII Health Sciences Centre (Halifax)",
    },
    { value: "IWK Health Centre", label: "IWK Health Centre" },
    {
      value: "Saint John Regional Hospital",
      label: "Saint John Regional Hospital",
    },
    { value: "Moncton Hospital", label: "Moncton Hospital" },
  ];

  const doctorOptions = [
    { value: "Dr. Sarah Johnson", label: "Dr. Sarah Johnson" },
    { value: "Dr. Michael Chen", label: "Dr. Michael Chen" },
    { value: "Dr. Emily Rodriguez", label: "Dr. Emily Rodriguez" },
    { value: "Dr. David Thompson", label: "Dr. David Thompson" },
    { value: "Dr. Jennifer Lee", label: "Dr. Jennifer Lee" },
    { value: "Dr. Robert Wilson", label: "Dr. Robert Wilson" },
    { value: "Dr. Amanda Brown", label: "Dr. Amanda Brown" },
    { value: "Dr. James Miller", label: "Dr. James Miller" },
    { value: "Dr. Lisa Davis", label: "Dr. Lisa Davis" },
    { value: "Dr. Kevin White", label: "Dr. Kevin White" },
    { value: "Dr. Maria Garcia", label: "Dr. Maria Garcia" },
    { value: "Dr. Thomas Anderson", label: "Dr. Thomas Anderson" },
    { value: "Dr. Rachel Martinez", label: "Dr. Rachel Martinez" },
    { value: "Dr. Christopher Taylor", label: "Dr. Christopher Taylor" },
    { value: "Dr. Nicole Harris", label: "Dr. Nicole Harris" },
    { value: "Dr. Daniel Clark", label: "Dr. Daniel Clark" },
    { value: "Dr. Jessica Lewis", label: "Dr. Jessica Lewis" },
    { value: "Any Available Doctor", label: "Any Available Doctor" },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!form.doctor) {
      showToast("Please select a doctor", "error");
      return;
    }

    if (!form.time) {
      showToast("Please select a date and time", "error");
      return;
    }

    if (!form.hospital) {
      showToast("Please select a hospital", "error");
      return;
    }

    const now = new Date();
    if (form.time <= now) {
      showToast("Please select a future date and time", "error");
      return;
    }

    setIsLoading(true);

    try {
      await appointmentAPI.book({
        doctor: form.doctor,
        time: form.time.toISOString(),
        hospital: form.hospital,
        diseaseConclusion: conclusion.disease,
        severity: conclusion.severity,
        medications: conclusion.medications,
      });
      showToast("Appointment booked successfully!", "success");
      onBooked();
    } catch (err: any) {
      console.error("Booking error:", err);
      showToast(
        err.response?.data?.message || "Booking failed. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-sm max-w-lg w-full max-h-[85vh] flex flex-col relative z-30">
        <div className="p-4 border-b border-gray-200 bg-white rounded-t-2xl shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-black">Book Appointment</h2>
              <p className="text-gray-600 text-sm">
                Schedule your healthcare consultation
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-visible">
          <div className="p-4 bg-green-50 border-b border-gray-200">
            <h3 className="font-medium text-black mb-2">
              AI Diagnosis Summary
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
                <span className="text-black">
                  <strong>Condition:</strong> {conclusion.disease}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full shrink-0"></div>
                <span className="text-black">
                  <strong>Severity:</strong> {conclusion.severity}
                </span>
              </div>
              {conclusion.medications.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full shrink-0"></div>
                  <span className="text-black">
                    <strong>Recommended:</strong>{" "}
                    {conclusion.medications.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Schedule Your Appointment
              </h3>
              <div className="space-y-3">
                <CustomSelect
                  label="Hospital/Clinic"
                  placeholder="Select a hospital"
                  options={hospitalOptions}
                  value={form.hospital}
                  onChange={(value) => setForm({ ...form, hospital: value })}
                />

                <CustomSelect
                  label="Preferred Doctor"
                  placeholder="Select a doctor"
                  options={doctorOptions}
                  value={form.doctor}
                  onChange={(value) => setForm({ ...form, doctor: value })}
                />

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Preferred Date & Time
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={form.time}
                      onChange={(date) =>
                        date && setForm({ ...form, time: date })
                      }
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      minDate={new Date()}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 cursor-pointer"
                      placeholderText="Select date and time"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 shrink-0 rounded-b-2xl">
          <button
            onClick={onClose}
            className="btn-secondary cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}
