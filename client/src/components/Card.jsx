import { Link } from "react-router-dom";

const Card = ({ post }) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {post.coverImage && (
        <Link
          to={`/posts/${post.slug}`}
          aria-label={`Read ${post.title}`}
          className="block overflow-hidden bg-stone-100"
        >
          <img
            src={post.coverImage}
            alt={post.title}
            className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-sm text-stone-500">
          <span className="font-medium text-stone-700">
            {post.author?.name || "Author"}
          </span>
          <span aria-hidden="true"> · </span>
          <time dateTime={post.publishedAt || post.createdAt}>
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
          </time>
        </p>

        <h2 className="mt-3 text-xl font-bold leading-snug tracking-tight text-stone-950">
          <Link
            to={`/posts/${post.slug}`}
            className="transition hover:text-emerald-800 focus:outline-none focus:underline"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mt-3 line-clamp-3 leading-7 text-stone-600">
          {post.excerpt}
        </p>

        {post.tags?.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {post.tags.map((tag) => (
              <Link
                key={tag._id}
                to={`/tags/${tag.slug}`}
                className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-600 transition hover:bg-stone-200 hover:text-stone-900"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default Card;
