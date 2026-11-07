import { useEffect, useState } from "react";
import api from "../api/api.js";
import Card from "../components/Card.jsx";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Load published posts
  const loadPosts = async (searchText = "") => {
    try {
      setError("");

      const res = await api.get("/posts", {
        params: searchText ? { search: searchText } : {},
      });

      setPosts(res.data.data.posts);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load posts");
    }
  };

  // Load posts when page opens
  useEffect(() => {
    loadPosts();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    loadPosts(search.trim());
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Stories for curious minds
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-stone-950 sm:text-6xl">
            Read, write, and share knowledge.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
            Explore thoughtful articles and fresh ideas from the developer
            community.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="search"
              aria-label="Search articles"
              placeholder="Search articles"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-stone-950 px-6 py-3 font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-stone-500">Discover</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
              Latest articles
            </h2>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0
            ? posts.map((post) => <Card key={post._id} post={post} />)
            : !error && (
                <p className="col-span-full rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-stone-500">
                  No articles found. Try another search.
                </p>
              )}
        </div>
      </section>
    </main>
  );
};

export default Home;
