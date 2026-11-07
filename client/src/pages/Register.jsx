import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      const response = await api.post("/auth/register", formData);

      const result = await response.data;

      if (!response.ok) {
        throw new Error(result.message);
      }

      localStorage.setItem("token", result.data.token);

      localStorage.setItem("user", JSON.stringify(result.data.user));

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
<<<<<<< HEAD
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
        />

        <button type="submit">Register</button>

        <p>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </form>
    </div>
=======
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-5 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <header className="mb-7">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            Join the community
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
            Create account
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Sign up to read, write, and share ideas.
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
              Name
            </span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-stone-950 px-5 py-3 font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
        >
          Register
        </button>

        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-800 underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
>>>>>>> 5420f2b (Initialized client and server)
  );
};

export default Register;
