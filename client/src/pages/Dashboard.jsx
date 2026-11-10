import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, logout, loading } = useAuth();

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleEditProfile = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <main
        role="status"
        aria-label="Loading dashboard"
        className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Session expired</h1>

          <p className="mt-2 text-sm text-slate-500">
            Please sign in again to access your dashboard.
          </p>

          <button
            onClick={() => navigate("/login", { replace: true })}
            className="mt-6 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              InkSpace / Overview
            </p>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              Welcome back, {user.name?.split(" ")[0] || "Author"}!
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Manage your profile and continue building your technical articles
              journey.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleEditProfile}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 sm:flex-none"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536M4 20l4.5-1 11-11a2.5 2.5 0 00-3.536-3.536l-11 11L4 20z"
                />
              </svg>
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 sm:flex-none"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12H3m0 0l4-4m-4 4l4 4m5-12h4a2 2 0 012 2v12a2 2 0 01-2 2h-4"
                />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 p-6 text-white shadow-lg sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs font-semibold tracking-wide text-teal-100">
              YOUR CREATOR SPACE
            </span>

            <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Your ideas deserve
              <span className="block text-teal-300">a place to grow.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
              InkSpace brings your writing identity together. Keep your profile
              updated and make your presence recognizable to readers and fellow
              developers.
            </p>

            <button
              onClick={handleEditProfile}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-900 transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-900"
            >
              Manage Your Profile
            </button>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Profile Overview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your public account information.
                </p>
              </div>

              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Account Active
              </span>
            </div>

            <div className="p-5 sm:p-7">
              {/* User Identity */}
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-7 sm:flex-row sm:items-center">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.name}'s avatar`}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    className="h-20 w-20 rounded-2xl border-4 border-teal-50 object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-800 text-2xl font-bold text-white shadow-sm">
                    {getInitials(user.name)}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                    {user.name}
                  </h3>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {user.email}
                  </p>

                  <span className="mt-3 inline-flex rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                    InkSpace Member
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 gap-6 pt-7 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Full Name
                  </p>
                  <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                    {user.name || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Email Address
                  </p>
                  <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                    {user.email}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    About You
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                    {user.bio ||
                      "You haven't added a bio yet. Tell readers a little about yourself."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Account Information */}
          <aside className="flex flex-col gap-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">Account Details</h3>
                  <p className="text-xs text-slate-500">
                    Your membership information
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Member Since
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not available"}
                </p>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Account Status
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active
                </p>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-bold text-slate-900">Quick Actions</h3>

              <p className="mt-1 text-sm text-slate-500">
                Manage your InkSpace account.
              </p>

              <div className="mt-5 space-y-3">
                <Link to="/tags">
                  <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800">
                    Explore Tags
                    <span aria-hidden="true">→</span>
                  </button>
                </Link>
              </div>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-200 py-6 text-center">
          <p className="text-xs font-medium text-slate-400">
            © {new Date().getFullYear()} InkSpace. Your space to create and
            share.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Dashboard;
