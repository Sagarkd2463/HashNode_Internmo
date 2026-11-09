import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-5 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <header className="mb-7">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            Welcome back
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
            Log in
          </h1>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Sign in to continue to your account.
          </p>
        </header>

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-800">
              Email
            </span>

            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-800">
              Password
            </span>

            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-stone-950 px-5 py-3 font-semibold text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="mt-6 text-center text-sm text-stone-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-emerald-800 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
