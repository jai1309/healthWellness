// ErrorAlert provides a reusable, user-friendly way to surface failures such as
// network errors, authentication problems, and validation issues.
function ErrorAlert({ message, title = 'Action Required' }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{message}</p>
    </div>
  );
}

export default ErrorAlert;
