"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary. Renders a friendly recovery UI and offers a
 * retry. The digest lets you correlate with server logs without exposing the
 * error details to users.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook point for an error-monitoring service (e.g. Sentry). Avoid logging
    // PII; the digest is a safe correlation id.
    // console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
      <h1 className="font-display text-3xl tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-muted">
        An unexpected error occurred. Please try again.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-muted tabular">Ref: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-8 bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wide text-accent-contrast transition-colors hover:bg-tpc-white hover:text-tpc-black"
      >
        Try again
      </button>
    </div>
  );
}
