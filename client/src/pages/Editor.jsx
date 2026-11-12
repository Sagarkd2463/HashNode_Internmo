import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";
import Markdown from "../components/Markdown.jsx";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    content: "",
    coverImage: "",
    status: "draft",
    tags: [],
  });

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load tags and post
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get all tags
        const tagRes = await api.get("/tags");
        setTags(tagRes.data.data.tags);

        // Get existing post when editing
        if (id) {
          const postRes = await api.get("/posts/mine");

          const posts = postRes.data.data.posts;

          const p = posts.find((item) => item._id === id);

          if (!p) {
            setError("Post not found");
            return;
          }

          setPost({
            title: p.title,
            content: p.content,
            coverImage: p.coverImage || "",
            status: p.status,
            tags: (p.tags || []).map((tag) => tag._id || tag),
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Could not load data");
      }
    };

    loadData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  // Select or remove tags
  const handleTag = (tagId) => {
    setPost((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  // Add new tag
  const addTag = async () => {
    if (!newTag.trim()) return;

    try {
      const res = await api.post("/tags", {
        name: newTag.trim(),
      });

      const tag = res.data.data.tag;

      setTags((prev) =>
        prev.some((item) => item._id === tag._id) ? prev : [...prev, tag],
      );

      setPost((prev) => ({
        ...prev,
        tags: [...new Set([...prev.tags, tag._id])],
      }));

      setNewTag("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create tag");
    }
  };

  // Save post
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (id) {
        // Update existing post
        await api.put(`/posts/${id}`, post);
      } else {
        // Create new post
        await api.post("/posts", post);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
            Your writing space
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            {id ? "Edit post" : "Write a post"}
          </h1>
        </header>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Editor Form */}
          <form
            className="space-y-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
            onSubmit={handleSave}
          >
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-800">
                Title
              </span>
              <input
                type="text"
                name="title"
                value={post.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                placeholder="Give your post a title"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-800">
                Cover image URL
              </span>
              <input
                type="url"
                name="coverImage"
                value={post.coverImage}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                placeholder="https://example.com/image.jpg"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-800">
                Markdown content
              </span>
              <textarea
                name="content"
                rows={18}
                value={post.content}
                onChange={handleChange}
                required
                className="w-full resize-y rounded-lg border border-stone-300 bg-white px-4 py-3 font-mono text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                placeholder="Write your post in Markdown..."
              />
            </label>

            <label className="block max-w-xs">
              <span className="mb-2 block text-sm font-semibold text-stone-800">
                Status
              </span>
              <select
                name="status"
                value={post.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>

            {/* Select Tags */}
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-stone-800">
                Tags
              </legend>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const selected = post.tags.includes(tag._id);

                  return (
                    <label
                      key={tag._id}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                        selected
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleTag(tag._id)}
                        className="sr-only"
                      />
                      {tag.name}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Add New Tag */}
            <div>
              <label
                htmlFor="new-tag"
                className="mb-2 block text-sm font-semibold text-stone-800"
              >
                Add a tag
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="new-tag"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter new tag"
                  className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-lg border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-300"
                >
                  Add tag
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="border-t border-stone-100 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Saving…" : "Save post"}
              </button>
            </div>
          </form>

          {/* Live Preview */}
          <aside className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 px-5 py-4 sm:px-8">
              <p className="text-sm font-medium text-stone-500">Live preview</p>
            </div>

            <article className="px-5 py-7 sm:px-8 sm:py-10">
              <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-stone-950">
                {post.title || "Your post title"}
              </h2>

              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title || "Post cover"}
                  className="mb-8 max-h-80 w-full rounded-xl object-cover"
                />
              )}

              {post.content ? (
                <div className="prose prose-stone max-w-none">
                  <Markdown content={post.content} />
                </div>
              ) : (
                <p className="text-stone-400">
                  Your post preview will appear here as you write.
                </p>
              )}
            </article>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Editor;
