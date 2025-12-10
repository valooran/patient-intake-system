// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useStore";
import { useToast } from "@/contexts/ToastContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Empty field validation
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

    setIsLoading(true);

    try {
      const { data } = await authAPI.login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      login(data);
      showToast("Welcome back!", "success");
      navigate("/" + data.user.role);
    } catch (err) {
      showToast("Invalid email or password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              HealthAI
            </Link>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-secondary">Don't have an account?</span>
              <Link to="/signup" className="btn-secondary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome back</h1>
          <p className="text-secondary">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary mb-2"
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary mb-2"
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
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-secondary">
            By signing in, you agree to our{" "}
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
