// GoalCard shows one wellness metric on the patient dashboard.
function GoalCard({ title, value, target, unit }) {
  const progressPercentage = Math.min(Math.round((value / target) * 100), 100);

  return (
    <article className="panel-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {value}
            <span className="ml-2 text-sm font-medium text-slate-500">{unit}</span>
          </p>
        </div>
        <span className="rounded-full bg-wellness-100 px-3 py-1 text-xs font-semibold text-wellness-700">
          {progressPercentage}% of target
        </span>
      </div>

      <div className="mt-5">
        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-green-500 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-slate-500">Target: {target} {unit}</p>
      </div>
    </article>
  );
}

export default GoalCard;
