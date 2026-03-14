// Centralized logger helpers keep console output consistent across pages,
// components, and API services. In production, this file can later be swapped
// to forward logs to an observability platform instead of the browser console.

function buildPrefix(level) {
  return `[${new Date().toISOString()}] [${level}]`;
}

// logInfo is used for expected lifecycle events such as route loads,
// authentication success, and API request starts.
export function logInfo(message, context) {
  console.log(buildPrefix('INFO'), message, context ?? '');
}

// logWarning is used for recoverable situations such as validation edge cases
// or empty data sets that the UI can still handle gracefully.
export function logWarning(message, context) {
  console.warn(buildPrefix('WARN'), message, context ?? '');
}

// logError is reserved for exceptions, failed API calls, and unexpected states
// that engineers will want to inspect during debugging.
export function logError(message, error) {
  console.error(buildPrefix('ERROR'), message, error ?? '');
}
