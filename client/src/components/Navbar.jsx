import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-teal-50 text-teal-800"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex min-h-[72px] items-center justify-between gap-3">
          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex min-w-0 items-center gap-2.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm transition group-hover:bg-teal-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M5 4h14v16H5z" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                Ink<span className="text-teal-700">Space</span>
              </h1>
              <p className="hidden text-[10px] font-medium tracking-wider text-slate-500 sm:block">
                IDEAS. STORIES. KNOWLEDGE.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex lg:gap-2"
          >
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/tags" className={navLinkClass}>
              Explore
            </NavLink>

            {!loading && (
              <>
                {user ? (
                  <>
                    <NavLink to="/dashboard" className={navLinkClass}>
                      Dashboard
                    </NavLink>

                    <NavLink to="/profile" className={navLinkClass}>
                      Profile
                    </NavLink>

                    <div className="ml-2 flex items-center gap-2 border-l border-slate-200 pl-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                        {initials}
                      </div>

                      <span className="max-w-[130px] truncate text-sm font-semibold text-slate-700">
                        {user.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="ml-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className={navLinkClass}>
                      Log in
                    </NavLink>

                    <Link
                      to="/register"
                      className="ml-1 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 md:hidden"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className={`grid transition-all duration-300 ease-in-out md:hidden ${
            menuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!menuOpen}
        >
          <div className="overflow-hidden">
            <div className="space-y-1 border-t border-slate-100 py-4">
              <NavLink
                to="/"
                end
                className={navLinkClass}
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
              >
                Home
              </NavLink>

              <NavLink
                to="/tags"
                className={navLinkClass}
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
              >
                Explore
              </NavLink>

              {!loading && (
                <>
                  {user ? (
                    <>
                      <NavLink
                        to="/dashboard"
                        className={navLinkClass}
                        onClick={closeMenu}
                        tabIndex={menuOpen ? 0 : -1}
                      >
                        Dashboard
                      </NavLink>

                      <NavLink
                        to="/profile"
                        className={navLinkClass}
                        onClick={closeMenu}
                        tabIndex={menuOpen ? 0 : -1}
                      >
                        Profile
                      </NavLink>

                      <div className="mt-3 flex items-center gap-3 border-t border-slate-200 px-3 py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">Signed in</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        tabIndex={menuOpen ? 0 : -1}
                        className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2.5 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        tabIndex={menuOpen ? 0 : -1}
                        className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Log in
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeMenu}
                        tabIndex={menuOpen ? 0 : -1}
                        className="rounded-lg bg-teal-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-teal-800"
                      >
                        Get Started
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
