import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import CustomSelect from "@/components/CustomSelect";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "admin",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const roleOptions = [
    { value: "user", label: "Patient" },
    { value: "admin", label: "Healthcare Provider" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName.trim()) {
      showToast("First name is required", "error");
      return;
    }

    if (!form.lastName.trim()) {
      showToast("Last name is required", "error");
      return;
    }

    if (!form.email.trim()) {
      showToast("Email is required", "error");
      return;
    }

    if (!validateEmail(form.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (!form.password) {
      showToast("Password is required", "error");
      return;
    }

    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return;
    }

    if (!form.confirmPassword) {
      showToast("Please confirm your password", "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });
      showToast("Account created successfully!", "success");
      navigate("/login");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-primary">
              HealthAI
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-secondary text-sm">
                Already have an account?
              </span>
              <Link to="/login" className="btn-secondary">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-primary mb-1">
            Join HealthAI
          </h1>
          <p className="text-secondary text-sm">
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-primary mb-1.5"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={form.firstName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-primary mb-1.5"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={form.lastName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          <CustomSelect
            label="Account Type"
            placeholder="Select account type"
            options={roleOptions}
            value={form.role}
            onChange={(value) =>
              setForm({ ...form, role: value as "user" | "admin" })
            }
          />

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Create a password"
              minLength={6}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-primary mb-1.5"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 sm:mt-5 text-center">
          <p className="text-xs text-secondary">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-accent hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-accent hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
