import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { Feedback } from "@/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  feedbacks: Feedback[];
}

export default function FeedbackChart({ feedbacks }: Props) {
  const ratingsCount = [0, 0, 0, 0, 0];
  feedbacks.forEach((fb) => {
    if (fb.rating >= 1 && fb.rating <= 5) {
      ratingsCount[fb.rating - 1]++;
    }
  });

  const data = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Ratings",
        data: ratingsCount,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "AI Chatbot Feedback Ratings" },
    },
  };

  return <Bar data={data} options={options} />;
}
