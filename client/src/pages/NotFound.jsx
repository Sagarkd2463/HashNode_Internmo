<<<<<<< HEAD
import react from react;
=======
import react from "react";
>>>>>>> 5420f2b (Initialized client and server)
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
<<<<<<< HEAD
    <div className="panel">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>

      <Link to="/">Go to Home</Link>
    </div>
=======
    <main className="flex min-h-[70vh] items-center justify-center bg-stone-50 px-5 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          404 error
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
          Page not found
        </h1>

        <p className="mt-4 leading-7 text-stone-600">
          Sorry, the page you’re looking for doesn’t exist or may have moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
        >
          Go to home
        </Link>
      </section>
    </main>
>>>>>>> 5420f2b (Initialized client and server)
  );
};

export default NotFound;