import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { publicHealthSections } from '../data/mockData';
import { useAuth } from "../context/useAuth";

function PublicHealthInfo() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar title="Preventive health education" isPublic={!currentUser} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="hero-mesh panel-card overflow-hidden p-8 lg:p-10">
          <span className="soft-chip">Health topics</span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">
            Trusted preventive health information for everyday decisions.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            This public section stays available without authentication so visitors can explore
            common preventive guidance before signing in as a patient or provider.
          </p>
          {!currentUser ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login?role=patient" className="button-primary">
                Patient Login
              </Link>
              <Link to="/login?role=provider" className="button-secondary">
                Provider Login
              </Link>
            </div>
          ) : null}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {publicHealthSections.map((section) => (
            <article key={section.id} className="panel-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                Advisory
              </p>
              <h2 className="mt-4 text-2xl font-bold text-slate-950">{section.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{section.description}</p>
              <button type="button" className="button-secondary mt-6">
                Read More
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default PublicHealthInfo;
