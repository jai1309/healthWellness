import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/useAuth";

// Navbar handles both the public portal navigation and the authenticated
// dashboard header so users always have a clear next action.
function Navbar({ title, isPublic = false }) {
  const navigate = useNavigate();
  const { currentUser, logout, role } = useAuth();

  const publicLinks = [
    { label: 'Home', href: '/#home' },
    { label: 'Health Topics', href: '/#topics' },
    { label: 'Services', href: '/#services' },
    { label: 'Contacts', href: '/#contacts' },
  ];

  // handleLogout clears auth state and returns the user to the public portal.
  function handleLogout() {
    logout();
    navigate('/');
  }

  if (isPublic) {
    return (
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-950">
              HealthTrack Portal
            </Link>
            <p className="text-sm text-slate-500">{title}</p>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            {publicLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-600 transition hover:text-blue-700"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login?role=patient" className="button-secondary hidden sm:inline-flex">
              Login as Patient
            </Link>
            <Link to="/login?role=provider" className="button-primary">
              Login as Provider
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            Connected Care Workspace
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/" className="button-secondary hidden sm:inline-flex">
            Public Portal
          </Link>
          <div className="rounded-2xl bg-slate-100 px-4 py-2 text-right">
            <p className="text-sm font-semibold text-slate-900">{currentUser?.name}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {role}
            </p>
          </div>
          <button type="button" onClick={handleLogout} className="button-primary">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
