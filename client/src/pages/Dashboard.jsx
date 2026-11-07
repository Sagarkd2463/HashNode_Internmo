import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }

    const getUser = async () => {
      try {
        const response = await api.get("/auth/me");

        setUser(response.data.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
      }
    };

    getUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  if (!user) {
<<<<<<< HEAD
    return <h2>Loading....</h2>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}!</h1>

      <p>Email: {user.email}</p>

      <p>Bio: {user.bio || "No bio added"}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
=======
    return (
      <main
        role="status"
        aria-live="polite"
        className="flex min-h-[60vh] items-center justify-center px-6"
      >
        <p className="animate-pulse text-sm font-medium text-stone-500">
          Loading your dashboard…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8">
      <section className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-stone-500">
            Your dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Welcome, {user.name}!
          </h1>
        </div>

        <dl className="divide-y divide-stone-100">
          <div className="py-5">
            <dt className="text-sm font-medium text-stone-500">Email</dt>
            <dd className="mt-1 break-words text-base text-stone-900">
              {user.email}
            </dd>
          </div>

          <div className="py-5">
            <dt className="text-sm font-medium text-stone-500">Bio</dt>
            <dd className="mt-1 whitespace-pre-wrap text-base leading-7 text-stone-700">
              {user.bio || "No bio added yet."}
            </dd>
          </div>
        </dl>

        <div className="mt-8 border-t border-stone-100 pt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </section>
    </main>
>>>>>>> 5420f2b (Initialized client and server)
  );
};

export default Dashboard;
