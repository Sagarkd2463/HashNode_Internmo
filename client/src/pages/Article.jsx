import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api.js";
import Markdown from "../components/Markdown.jsx";

const Article = () => {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/posts/${slug}`)
      .then((res) => {
        setPost(res.data.data.post);
      })
      .catch(() => {
        setError("Article not found");
      });
  }, [slug]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
        >
          {error}
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        role="status"
        className="mx-auto max-w-3xl px-5 py-20 sm:px-8"
        aria-live="polite"
      >
        <p className="animate-pulse text-center text-stone-500">
          Loading article…
        </p>
      </div>
    );
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <p className="mb-5 text-sm text-stone-500">
          By{" "}
          <span className="font-medium text-stone-800">
            {post.author?.name || "Author"}
          </span>
        </p>

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-950 sm:text-5xl">
          {post.title}
        </h1>

        {post.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-600 transition hover:bg-stone-200 hover:text-stone-900"
                key={tag._id}
                to={`/tags/${tag.slug}`}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.coverImage && (
        <figure className="mb-10 overflow-hidden rounded-xl bg-stone-100">
          <img
            className="max-h-[32rem] w-full object-cover"
            src={post.coverImage}
            alt={post.title}
          />
        </figure>
      )}

      <div className="article-content text-lg leading-8 text-stone-800">
        <Markdown content={post.content} />
      </div>
    </article>
  );
};

export default Article;
