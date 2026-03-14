import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from "../context/useAuth";

// PortalLayout creates a more polished application shell for all protected pages.
function PortalLayout({ title, intro, children }) {
  const { role } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar title={title} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="hero-mesh panel-card mb-6 overflow-hidden px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="soft-chip">Secure wellness workspace</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 lg:text-4xl">
                {title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{intro}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="metric-card min-w-[160px]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Access level
                </p>
                <p className="mt-3 text-2xl font-bold text-slate-950">
                  {role === 'provider' ? 'Provider' : 'Patient'}
                </p>
              </div>
              <div className="metric-card min-w-[160px]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Data scope
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {role === 'provider' ? 'Multiple assigned patients' : 'Only your own record'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="portal-grid">
          <Sidebar role={role} />
          <section className="space-y-6">{children}</section>
        </div>
      </main>
    </div>
  );
}

export default PortalLayout;
