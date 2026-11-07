import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/api.js";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Update profile
  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const res = await api.put("/users/me", form);

      const updatedUser = res.data.data.user;

      setUser(updatedUser);

      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8">
      <section className="mx-auto w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
            Profile settings
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Update the details people see on your profile.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSave}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-800">
              Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-800">
              Bio
            </span>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Write something about yourself"
              rows={5}
              className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-stone-800">
              Avatar URL
            </span>
            <input
              type="url"
              name="avatarUrl"
              value={form.avatarUrl}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <div className="border-t border-stone-100 pt-5">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {message}
          </p>
        )}
      </section>
    </main>
  );
};

export default Profile;
