import { Link } from "react-router-dom";

const Card = ({ post }) => {
  const publishedDate = post.publishedAt || post.createdAt;

  const formattedDate =
    publishedDate && !isNaN(new Date(publishedDate).getTime())
      ? new Date(publishedDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recently";

  const authorName = post.author?.name || "Anonymous Author";

  const authorInitials = authorName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Cover Image */}
      <Link
        to={`/posts/${post.slug}`}
        className="relative block aspect-video overflow-hidden bg-slate-100"
        aria-label={`Read ${post.title}`}
      >
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-100 to-slate-100">
            <span className="text-4xl font-bold text-teal-700">
              {post.title?.charAt(0)?.toUpperCase() || "A"}
            </span>
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-teal-800">
          Article
        </span>
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Author and Date */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
            {authorInitials}
          </div>

          <span className="max-w-[130px] truncate font-semibold text-slate-800">
            {authorName}
          </span>

          <span className="text-slate-300">•</span>

          <time
            dateTime={
              publishedDate ? new Date(publishedDate).toISOString() : undefined
            }
          >
            {formattedDate}
          </time>
        </div>

        {/* Title */}
        <h2 className="mt-4 text-xl font-bold leading-snug text-slate-900">
          <Link
            to={`/posts/${post.slug}`}
            className="transition-colors hover:text-teal-700"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {post.excerpt ||
            "Discover this article and explore more ideas on InkSpace."}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {post.tags.slice(0, 4).map((tag) => (
              <Link
                key={tag._id || tag.slug}
                to={`/tags/${tag.slug}`}
                className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 transition-colors hover:bg-teal-100"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Read More */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <Link
            to={`/posts/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition-all hover:gap-3 hover:text-teal-900"
          >
            Read article
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Card;
