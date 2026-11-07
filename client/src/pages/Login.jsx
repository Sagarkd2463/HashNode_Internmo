import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", formData);

      const result = await response.data;

      if (!response.ok) {
        throw new Error(result.message);
      }

      localStorage.setItem("token", result.data.token);

      localStorage.setItem("user", JSON.stringify(result.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failure. Try again");
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
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
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
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-stone-950 px-5 py-3 font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
        >
          Log in
        </button>

        <p className="mt-6 text-center text-sm text-stone-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-emerald-800 underline-offset-4 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
