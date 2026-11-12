import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import api from "../api/api.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Author initials
  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Fetch logged-in user's articles
  useEffect(() => {
    if (loading) return;

    if (!user) {
      setPostsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchMyPosts = async () => {
      try {
        setPostsLoading(true);
        setError("");

        const res = await api.get("/posts/mine");

        if (!cancelled) {
          setPosts(res.data.data.posts || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Could not load your articles.",
          );
        }
      } finally {
        if (!cancelled) {
          setPostsLoading(false);
        }
      }
    };

    fetchMyPosts();

    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Delete article
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/posts/${id}`);

      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete article.");
    } finally {
      setDeletingId(null);
    }
  };

  // Date formatting
  const formatDate = (dateValue) => {
    if (!dateValue) return "Not available";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Loading screen
  if (loading) {
    return (
      <main
        role="status"
        className="flex min-h-screen items-center justify-center bg-slate-50"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />
      </main>
    );
  }

  // Unauthenticated user
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Session expired</h1>

          <p className="mt-2 text-sm text-slate-500">
            Please sign in again to access your dashboard.
          </p>

          <button
            onClick={() => navigate("/login", { replace: true })}
            className="mt-6 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  // Statistics
  const publishedPosts = posts.filter(
    (post) => post.status === "published",
  ).length;

  const draftPosts = posts.filter((post) => post.status === "draft").length;

  const authorName = user.name || "Author";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              InkSpace / Overview
            </p>

            <h1 className="text-2xl font-extrabold text-slate-950 sm:text-3xl lg:text-4xl">
              Welcome back, {authorName.split(" ")[0]}!
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage your profile and continue writing articles.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/profile"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-teal-50 sm:flex-none"
            >
              Edit Profile
            </Link>

            <button
              onClick={handleLogout}
              className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:flex-none"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 p-6 text-white shadow-lg sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[35px] border-white/5" />

          <div className="pointer-events-none absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-100">
              YOUR CREATOR SPACE
            </span>

            <h2 className="mt-5 text-2xl font-bold sm:text-3xl lg:text-4xl">
              Your ideas deserve
              <span className="block text-teal-300">a place to grow.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">
              Share your knowledge, publish technical articles, and connect with
              readers and fellow developers.
            </p>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Articles</p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {postsLoading ? "..." : posts.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Published</p>

            <h2 className="mt-2 text-3xl font-bold text-teal-700">
              {postsLoading ? "..." : publishedPosts}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Drafts</p>

            <h2 className="mt-2 text-3xl font-bold text-amber-600">
              {postsLoading ? "..." : draftPosts}
            </h2>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Overview */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Profile Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your public account information.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Account Active
              </span>
            </div>

            <div className="p-5 sm:p-7">
              {/* User Information */}
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-7 sm:flex-row sm:items-center">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-800 text-2xl font-bold text-white">
                  {getInitials(user.name)}

                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={`${authorName}'s avatar`}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                    {authorName}
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
                    {user.email || "Not provided"}
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
              <h3 className="font-bold text-slate-900">Account Details</h3>

              <p className="mt-1 text-xs text-slate-500">
                Your membership information.
              </p>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Member Since
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {formatDate(user.createdAt)}
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
                <Link
                  to="/tags"
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                >
                  Explore Tags
                  <span>→</span>
                </Link>
              </div>
            </section>
          </aside>
        </div>

        {/* My Articles */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">My Articles</h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your published articles and drafts.
              </p>
            </div>

            <Link
              to="/tags"
              className="text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              Explore Tags →
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Loading */}
          {postsLoading ? (
            <div
              role="status"
              className="py-12 text-center text-sm text-slate-500"
            >
              Loading your articles...
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-teal-200 sm:flex-row sm:items-center"
                >
                  {/* Article Information */}
                  <div className="min-w-0">
                    <h3 className="break-words font-bold text-slate-900">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {post.excerpt || "No excerpt available."}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {post.status}
                      </span>

                      <span className="text-xs text-slate-400">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Article Actions */}
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {post.status === "published" && (
                      <Link
                        to={`/posts/${post.slug}`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        View
                      </Link>
                    )}

                    <Link
                      to={`/editor/${post._id}`}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id)}
                      disabled={deletingId === post._id}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === post._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                No articles yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                You haven't written any articles yet. Start sharing your ideas!
              </p>

              <Link
                to="/new-post"
                className="mt-5 inline-block rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Write Your First Article
              </Link>
            </div>
          )}
        </section>

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
