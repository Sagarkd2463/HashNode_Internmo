import { Link } from "react-router-dom";

const Card = ({ post }) => {
  const publishedDate = post.publishedAt || post.createdAt;

  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const authorName = post.author?.name || "Anonymous Author";

  const authorInitials = authorName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl">
      {/* Cover Image */}
      <Link
        to={`/posts/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="relative block aspect-[16/9] overflow-hidden bg-slate-100"
      >
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 via-cyan-50 to-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className="h-12 w-12 text-teal-700/50"
              aria-hidden="true"
            >
              <path d="M5 4h14v16H5z" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
          </div>
        )}

        {/* Image overlay label */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-white/50 bg-white/90 px-3 py-1 text-xs font-semibold text-teal-800 shadow-sm backdrop-blur-sm">
            Article
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
        {/* Author and Date */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
            {authorInitials}
          </div>

          <span className="max-w-[130px] truncate font-semibold text-slate-800">
            {authorName}
          </span>

          <span aria-hidden="true" className="text-slate-300">
            •
          </span>

          <time dateTime={publishedDate || undefined}>{formattedDate}</time>
        </div>

        {/* Post Title */}
        <h2 className="mt-4 text-lg font-bold leading-snug tracking-tight text-slate-900 transition-colors duration-200 sm:text-xl">
          <Link
            to={`/posts/${post.slug}`}
            className="rounded-sm hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            {post.title}
          </Link>
        </h2>

        {/* Post Excerpt */}
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
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
                className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 transition-all duration-200 hover:border-teal-300 hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
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
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition-all duration-200 hover:gap-3 hover:text-teal-900 focus:outline-none focus-visible:underline"
          >
            Read article
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Card;
