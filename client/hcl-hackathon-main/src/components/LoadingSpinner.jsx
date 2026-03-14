// LoadingSpinner is reused across pages whenever async mock/API data is loading.
function LoadingSpinner({ label = 'Loading your healthcare data...' }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-white/80 px-6 py-10 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}

export default LoadingSpinner;
