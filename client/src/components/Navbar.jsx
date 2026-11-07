import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
<<<<<<< HEAD
    <header>
      <Link to="/" className="brand">
        Hashnode Blog
      </Link>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/tags">Tags</Link>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>

            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
=======
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-stone-950 transition hover:text-emerald-800"
        >
          Hashnode Blog
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-stone-600"
        >
          <Link to="/" className="transition hover:text-stone-950">
            Home
          </Link>
          <Link to="/tags" className="transition hover:text-stone-950">
            Tags
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="transition hover:text-stone-950">
                Dashboard
              </Link>
              <Link to="/profile" className="transition hover:text-stone-950">
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-stone-300 px-3 py-2 text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-stone-300"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="transition hover:text-stone-950">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-stone-950 px-4 py-2 text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
>>>>>>> 5420f2b (Initialized client and server)
    </header>
  );
};

export default Navbar;
