import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";

const Tags = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/tags");
        setTags(res.data.data.tags);
      } catch (error) {
        console.log(
          "Error fetching tags:",
          error?.response?.data?.message || error.message,
        );
      }
    };

    fetchTags();
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            Find your next read
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Explore tags
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Browse published posts by topic and discover ideas from the
            community.
          </p>
        </header>

        {tags.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => (
              <Link
                key={tag._id}
                to={`/tags/${tag.slug}`}
                className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
              >
                <h2 className="text-lg font-semibold text-stone-900 transition group-hover:text-emerald-800">
                  <span className="mr-1 text-emerald-700">#</span>
                  {tag.name}
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  {tag.postCount || 0} published{" "}
                  {(tag.postCount || 0) === 1 ? "post" : "posts"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-stone-500">
            No tags to show yet.
          </p>
        )}
      </section>
    </main>
  );
};

export default Tags;
