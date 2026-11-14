import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import api from "../api/api.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  // Dashboard states
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Account status states
  const [accountStatus, setAccountStatus] = useState("Loading");
  const [statusLoading, setStatusLoading] = useState(true);

  const userId = user?._id || user?.id;

  // Fetch user's articles
  useEffect(() => {
    if (loading) return;

    if (!userId) {
      setPosts([]);
      setPostsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchMyPosts = async () => {
      try {
        setPostsLoading(true);
        setError("");

        const response = await api.get("/posts/mine");

        const result = response.data?.data;

        const myPosts = Array.isArray(result)
          ? result
          : result?.posts || response.data?.posts || [];

        if (!cancelled) {
          setPosts(Array.isArray(myPosts) ? myPosts : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load your articles.",
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
  }, [userId, loading]);

  // Fetch latest account status
  useEffect(() => {
    if (loading) return;

    if (!userId) {
      setAccountStatus("Unknown");
      setStatusLoading(false);
      return;
    }

    let cancelled = false;

    const fetchAccountStatus = async () => {
      try {
        setStatusLoading(true);

        const response = await api.get("/auth/me");

        const latestUser = response.data?.data?.user;

        const status =
          latestUser?.status ||
          (latestUser?.isActive === false ? "Inactive" : null) ||
          user?.status ||
          (user?.isActive === false ? "Inactive" : "Active");

        if (!cancelled) {
          setAccountStatus(status);
        }
      } catch (err) {
        if (!cancelled) {
          setAccountStatus(
            user?.status ||
              (user?.isActive === false ? "Inactive" : "Unavailable"),
          );
        }
      } finally {
        if (!cancelled) {
          setStatusLoading(false);
        }
      }
    };

    fetchAccountStatus();

    return () => {
      cancelled = true;
    };
  }, [userId, loading]);

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
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

      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== id),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete this article.");
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Account status styles
  const statusStyles = {
    active: {
      badge: "bg-green-100 text-green-700",
      dot: "bg-green-500",
    },
    inactive: {
      badge: "bg-gray-100 text-gray-700",
      dot: "bg-gray-500",
    },
    suspended: {
      badge: "bg-red-100 text-red-700",
      dot: "bg-red-500",
    },
    pending: {
      badge: "bg-yellow-100 text-yellow-700",
      dot: "bg-yellow-500",
    },
    unavailable: {
      badge: "bg-gray-100 text-gray-600",
      dot: "bg-gray-400",
    },
    unknown: {
      badge: "bg-gray-100 text-gray-600",
      dot: "bg-gray-400",
    },
  };

  const normalizedStatus = String(accountStatus).toLowerCase();

  const currentStatusStyle =
    statusStyles[normalizedStatus] || statusStyles.unknown;

  // Dashboard statistics
  const totalPosts = posts.length;

  const publishedPosts = posts.filter(
    (post) => post.status === "published",
  ).length;

  const draftPosts = posts.filter((post) => post.status === "draft").length;

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-600 text-base sm:text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              My Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your articles and account.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition"
            >
              Home
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm sm:text-base bg-red-600 text-white hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-white mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold break-words">
            Welcome back, {user?.name || "Writer"}!
          </h2>

          <p className="mt-2 text-sm sm:text-base text-indigo-100">
            Manage your content, track your articles, and keep writing.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-5">
            <Link
              to="/editor"
              className="text-center px-5 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition"
            >
              + Write New Article
            </Link>

            <Link
              to="/tags"
              className="text-center px-5 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-400 transition border border-indigo-300"
            >
              Explore Tags
            </Link>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-5 sm:p-6">
            <p className="text-gray-500 text-sm">Total Articles</p>

            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              {postsLoading ? "..." : totalPosts}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5 sm:p-6">
            <p className="text-gray-500 text-sm">Published Articles</p>

            <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
              {postsLoading ? "..." : publishedPosts}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5 sm:p-6">
            <p className="text-gray-500 text-sm">Draft Articles</p>

            <h3 className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-2">
              {postsLoading ? "..." : draftPosts}
            </h3>
          </div>
        </section>

        {/* Profile Overview and Account Details */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Profile Overview */}
          <div className="bg-white rounded-xl shadow-sm border p-5 sm:p-6 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
              Profile Overview
            </h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left min-w-0">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`${user?.name || "User"} profile`}
                  className="w-16 h-16 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-16 h-16 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="min-w-0 w-full">
                <h4 className="text-lg font-semibold text-gray-900 break-words">
                  {user?.name || "User"}
                </h4>

                <p className="text-sm text-gray-500 break-all">
                  {user?.email || "No email available"}
                </p>

                <span
                  className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-semibold ${currentStatusStyle.badge}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${currentStatusStyle.dot}`}
                  />

                  {statusLoading ? "Loading..." : accountStatus}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mt-5 break-words">
              {user?.bio || "You haven't added a profile bio yet."}
            </p>

            <Link
              to="/profile"
              className="inline-block mt-5 text-indigo-600 font-medium hover:text-indigo-800 transition"
            >
              View / Edit Profile →
            </Link>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-xl shadow-sm border p-5 sm:p-6 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
              Account Details
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 gap-1 sm:gap-4">
                <span className="text-sm text-gray-500">Full Name</span>

                <span className="text-gray-900 font-medium text-sm sm:text-right break-words">
                  {user?.name || "Not available"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 gap-1 sm:gap-4">
                <span className="text-sm text-gray-500">Email Address</span>

                <span className="text-gray-900 font-medium text-sm sm:text-right break-all">
                  {user?.email || "Not available"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 gap-2 sm:gap-4">
                <span className="text-sm text-gray-500">Account Status</span>

                <span
                  className={`inline-flex self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold ${currentStatusStyle.badge}`}
                >
                  {statusLoading ? "Loading..." : accountStatus}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                <span className="text-sm text-gray-500">Joined On</span>

                <span className="text-gray-900 font-medium text-sm">
                  {formatDate(user?.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* My Articles */}
        <section className="bg-white rounded-xl shadow-sm border p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              My Articles
            </h3>

            <Link
              to="/editor"
              className="w-full sm:w-auto text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              + Create Article
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-5 text-sm"
            >
              {error}
            </div>
          )}

          {/* Loading */}
          {postsLoading ? (
            <div className="text-center py-10 text-gray-500">
              Loading your articles...
            </div>
          ) : posts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-10 sm:py-12">
              <h4 className="text-lg font-semibold text-gray-800">
                No articles yet
              </h4>

              <p className="text-gray-500 text-sm mt-2">
                Start sharing your ideas with the community.
              </p>

              <Link
                to="/editor"
                className="inline-block mt-5 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Write Your First Article
              </Link>
            </div>
          ) : (
            /* Articles List */
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="border rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:justify-between gap-5 min-w-0"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                      {post.title}
                    </h4>

                    <p className="text-sm text-gray-500 mt-2 break-words">
                      {post.excerpt || "No excerpt available."}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.status || "draft"}
                      </span>

                      <span className="text-xs text-gray-500">
                        Created: {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Article Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    {post.status === "published" && post.slug && (
                      <Link
                        to={`/posts/${post.slug}`}
                        className="flex-1 sm:flex-none text-center px-4 py-2 text-sm border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                      >
                        View
                      </Link>
                    )}

                    <Link
                      to={`/editor/${post._id}`}
                      className="flex-1 sm:flex-none text-center px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id)}
                      disabled={deletingId === post._id}
                      className="flex-1 sm:flex-none px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {deletingId === post._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-8 sm:mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} InkSpace. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
