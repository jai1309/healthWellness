import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  contactCards,
  landingHighlights,
  portalServices,
  publicHealthSections,
} from '../data/mockData';

function LandingPage() {
  return (
    <div className="min-h-screen" id="home">
      <Navbar title="Healthcare information and preventive care portal" isPublic />

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          <div className="hero-mesh panel-card overflow-hidden px-6 py-10 lg:px-10 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <span className="soft-chip">Healthcare Info Portal</span>
                <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Modern preventive care for patients and providers.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                  Start from a public health information portal, then move into role-based access.
                  Patients can review and edit only their own records. Providers can review
                  multiple patient records, reminders, and adherence signals from a unified view.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/login?role=patient" className="button-primary">
                    Login as Patient
                  </Link>
                  <Link to="/login?role=provider" className="button-secondary">
                    Login as Provider
                  </Link>
                  <Link to="/register?role=patient" className="button-secondary">
                    Create Account
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="metric-card sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    Portal flow
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-slate-950">
                    Public information first, secure records second.
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    The landing page introduces health topics, services, and contact information.
                    Login then routes patients and doctors into separate protected workspaces.
                  </p>
                </article>

                {landingHighlights.map((highlight) => (
                  <article key={highlight.id} className="metric-card">
                    <p className="text-3xl font-extrabold text-slate-950">{highlight.value}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{highlight.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {highlight.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="topics" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="soft-chip">Health Topics</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
                Latest health information
              </h2>
            </div>
            <Link to="/health-topics" className="button-secondary w-fit">
              View all topics
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {publicHealthSections.map((topic) => (
              <article key={topic.id} className="panel-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                  Public guidance
                </p>
                <h3 className="mt-4 text-2xl font-bold text-slate-950">{topic.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{topic.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="soft-chip">Services</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
              What this portal supports
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {portalServices.map((service) => (
              <article key={service.id} className="panel-card p-6">
                <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500" />
                <h3 className="text-xl font-bold text-slate-950">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contacts" className="mx-auto max-w-7xl px-4 py-8 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="soft-chip">Contacts</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
              Reach the care and portal teams
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {contactCards.map((contact) => (
              <article key={contact.id} className="panel-card p-6">
                <p className="text-sm font-semibold text-slate-500">{contact.title}</p>
                <p className="mt-4 text-xl font-bold text-slate-950">{contact.value}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{contact.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
