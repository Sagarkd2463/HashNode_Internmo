import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import Card from "../components/Card.jsx";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/posts", {
          params: search.trim() ? { search: search.trim() } : {},
        });

        setPosts(res.data.data.posts || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load articles.");
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchPosts, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Welcome to InkSpace
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-stone-950 sm:text-5xl">
            Ideas worth sharing.
          </h1>

          <p className="mt-4 max-w-2xl text-stone-600">
            Discover technical articles, explore new technologies and share your
            knowledge with the developer community.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/tags"
              className="rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold"
            >
              Explore Tags
            </Link>
          </div>
        </header>

        <div className="mb-8">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title..."
            className="w-full rounded-xl border border-stone-300 bg-white px-5 py-4 outline-none focus:border-emerald-600 sm:max-w-xl"
          />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-950">Latest Articles</h2>

          <Link to="/tags" className="text-sm font-semibold text-emerald-700">
            Browse Topics →
          </Link>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-12 text-center text-stone-500">
            Loading articles...
          </p>
        ) : posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post._id} post={post} />
            ))}
          </div>
        ) : (
          !error && (
            <p className="rounded-xl border border-dashed bg-white p-12 text-center text-stone-500">
              No published articles found.
            </p>
          )
        )}
      </section>
    </main>
  );
};

export default Home;
