import { formatDate } from '../services/api';

// ReminderCard renders one preventive care reminder for the patient dashboard.
function ReminderCard({ reminder_title, due_date, description, status }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-900">{reminder_title}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {status}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-700">{formatDate(due_date)}</p>
    </article>
  );
}

export default ReminderCard;
