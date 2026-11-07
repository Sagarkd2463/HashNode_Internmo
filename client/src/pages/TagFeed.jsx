import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api.js";
import Card from "../components/Card.jsx";

const TagFeed = () => {
  const { slug } = useParams();

  const [tag, setTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTagPosts = async () => {
      try {
        const res = await api.get(`/tags/${slug}/posts`);

        setTag(res.data.data.tag);
        setPosts(res.data.data.posts);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load tag posts");
      }
    };

    fetchTagPosts();
  }, [slug]);

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-stone-200 pb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            Browse by topic
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            {tag ? `#${tag.name}` : "Tag posts"}
          </h1>
          <p className="mt-3 text-stone-600">
            Articles from the community on this topic.
          </p>
        </header>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post._id} post={post} />
            ))}
          </div>
        ) : (
          !error && (
            <p className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-stone-500">
              No posts found for this tag yet.
            </p>
          )
        )}
      </section>
    </main>
  );
};

export default TagFeed;
