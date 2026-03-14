import { NavLink } from 'react-router-dom';

// Sidebar exposes the primary navigation for the authenticated portal.
// The patient sees only self-service routes, while the provider sees roster views.
function Sidebar({ role }) {
  const patientLinks = [
    { label: 'Overview', path: '/patient/dashboard', hint: 'Daily wellness summary' },
    { label: 'Goal Tracker', path: '/goal-tracker', hint: 'Log steps, sleep, water' },
    { label: 'My Record', path: '/profile', hint: 'Edit your own health record' },
    { label: 'Health Topics', path: '/health-topics', hint: 'Preventive guidance' },
  ];

  const providerLinks = [
    { label: 'Patient Roster', path: '/provider/dashboard', hint: 'Review multiple patients' },
    { label: 'My Profile', path: '/profile', hint: 'Update provider profile' },
    { label: 'Health Topics', path: '/health-topics', hint: 'Public education content' },
  ];

  const links = role === 'provider' ? providerLinks : patientLinks;

  return (
    <aside className="panel-card h-fit overflow-hidden lg:sticky lg:top-24">
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-500 px-5 py-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
          {role === 'provider' ? 'Provider Access' : 'Patient Access'}
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          {role === 'provider' ? 'Doctor Workspace' : 'My Wellness Portal'}
        </h2>
        <p className="mt-2 text-sm text-blue-50/90">
          {role === 'provider'
            ? 'Access assigned patient records, preventive follow-ups, and adherence summaries.'
            : 'View and edit only your own health record, goals, and preventive reminders.'}
        </p>
      </div>

      <nav className="space-y-2 p-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              [
                'block rounded-[22px] px-4 py-4 transition',
                isActive
                  ? 'bg-blue-600 text-white shadow-[0_20px_35px_-25px_rgba(37,99,235,0.85)]'
                  : 'bg-white text-slate-700 hover:bg-slate-50',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {link.label}
                </p>
                <p className={`mt-1 text-xs ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                  {link.hint}
                </p>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
