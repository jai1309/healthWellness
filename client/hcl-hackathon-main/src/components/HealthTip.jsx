// HealthTip highlights one short wellness recommendation on the dashboard.
function HealthTip({ title, content }) {
  return (
    <article className="panel-card bg-gradient-to-br from-medical-50 via-white to-wellness-100 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
        Tip of the Day
      </p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{content}</p>
    </article>
  );
}

export default HealthTip;
