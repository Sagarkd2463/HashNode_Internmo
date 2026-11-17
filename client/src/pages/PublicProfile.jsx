import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api.js";
import Card from "../components/Card.jsx";

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!id || id === "undefined" || id === "null") {
      setProfile(null);
      setPosts([]);
      setError("Profile not found.");
      setLoading(false);
      return;
    }
    
    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/users/${id}`);
        if (!cancelled) {
          const { user, posts: publishedPosts = [] } = response.data.data;
          setProfile(user);
          setPosts(publishedPosts.map((post) => ({ ...post, author: user })));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load this profile.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16 text-center text-slate-500">
        Loading profile…
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16 text-center">
        <p role="alert" className="text-rose-700">
          {error || "Profile not found."}
        </p>
        <Link to="/" className="mt-4 inline-block font-semibold text-teal-700">
          Back to articles
        </Link>
      </main>
    );
  }

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="mb-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:flex sm:items-center sm:gap-6 sm:p-9">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={`${profile.name}'s avatar`}
              className="mb-5 h-24 w-24 rounded-full object-cover sm:mb-0"
            />
          ) : (
            <div
              aria-hidden="true"
              className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-800 sm:mb-0"
            >
              {initials}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Developer profile
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-stone-950">
              {profile.name}
            </h1>
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-stone-600">
              {profile.bio || "This author has not added a bio yet."}
            </p>
          </div>
        </header>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-950">
              Published articles
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>
        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
            No published articles yet.
          </p>
        )}
      </section>
    </main>
  );
};

export default PublicProfile;
