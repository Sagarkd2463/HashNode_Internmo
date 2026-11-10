import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth.js";
import api from "../api/api.js";

const Profile = () => {
  const { user, setUser } = useAuth();

  const initialForm = {
    name: user?.name || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
  };

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Sync form when user data becomes available or changes.
  useEffect(() => {
    setForm({
      name: user?.name || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
    });
    setImageError(false);
  }, [user]);

  // Handle input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");

    if (name === "avatarUrl") {
      setImageError(false);
    }
  };

  // Generate user initials.
  const initials =
    form.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // Check whether profile data has changed.
  const hasChanges =
    form.name !== (user?.name || "") ||
    form.bio !== (user?.bio || "") ||
    form.avatarUrl !== (user?.avatarUrl || "");

  // Reset form.
  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
    });

    setImageError(false);
    setMessage("");
    setError("");
  };

  // Update profile.
  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (form.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        bio: form.bio.trim(),
        avatarUrl: form.avatarUrl.trim(),
      };

      const res = await api.put("/users/me", payload);

      const updatedUser = res.data.data.user;

      setUser(updatedUser);

      setForm({
        name: updatedUser.name || "",
        bio: updatedUser.bio || "",
        avatarUrl: updatedUser.avatarUrl || "",
      });

      setMessage("Your profile has been updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update your profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100";

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-teal-700">
            Account settings
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your personal information and customize how other members see
            you on InkSpace.
          </p>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Profile Overview */}
          <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
            {/* Banner */}
            <div className="relative h-28 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800">
              <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-12 left-16 h-32 w-32 rounded-full bg-cyan-300/10" />
            </div>

            {/* Avatar */}
            <div className="relative px-6 pb-6">
              <div className="-mt-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-teal-100 text-2xl font-extrabold text-teal-800 shadow-md">
                {form.avatarUrl && !imageError ? (
                  <img
                    src={form.avatarUrl}
                    alt={`${form.name || "User"} avatar`}
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="mt-4">
                <h2 className="break-words text-xl font-bold text-slate-900">
                  {form.name || "Your Name"}
                </h2>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {user?.email || "Your email address"}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
                  <span className="h-2 w-2 rounded-full bg-teal-600" />
                  InkSpace Member
                </span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  About me
                </p>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                  {form.bio ||
                    "Your bio will appear here. Tell the community something about yourself."}
                </p>
              </div>
            </div>
          </aside>

          {/* Profile Form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:col-span-2">
            <header className="mb-7 border-b border-slate-100 pb-6">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Personal information
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update your profile details and let people know more about you.
              </p>
            </header>

            {/* Success Message */}
            {message && (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800"
              >
                <span className="font-bold" aria-hidden="true">
                  ✓
                </span>
                <p>{message}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
              >
                <span className="font-bold" aria-hidden="true">
                  !
                </span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={80}
                  required
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-slate-400">
                  This is the name displayed on your articles and profile.
                </p>
              </div>

              {/* Email - Read Only */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Your registered email address cannot be changed here.
                </p>
              </div>

              {/* Bio */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="bio"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    About you
                  </label>

                  <span className="text-xs text-slate-400">
                    {form.bio.length} characters
                  </span>
                </div>

                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell the community something about yourself..."
                  rows={5}
                  className={`${inputClass} resize-y leading-7`}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Share your interests, experience or what you enjoy writing
                  about.
                </p>
              </div>

              {/* Avatar URL */}
              <div>
                <label
                  htmlFor="avatarUrl"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Profile picture URL
                </label>

                <input
                  id="avatarUrl"
                  type="url"
                  name="avatarUrl"
                  value={form.avatarUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Enter a publicly accessible image URL to update your avatar.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading || !hasChanges}
                  className="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Cancel changes
                </button>

                <button
                  type="submit"
                  disabled={loading || !hasChanges}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                        />
                      </svg>
                      Saving changes...
                    </>
                  ) : (
                    <>
                      Save changes
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Profile;
