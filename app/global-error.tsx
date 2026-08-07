"use client";

/**
 * Global error boundary — catches errors in the root layout itself. It must
 * render its own <html>/<body>. Kept minimal and dependency-free.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: "0.75rem", color: "#6b6b70" }}>
            Please refresh the page or try again shortly.
          </p>
          {error.digest ? (
            <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#6b6b70" }}>
              Ref: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              background: "#0b0b0c",
              color: "#f4f1ea",
              border: "none",
              borderRadius: "6px",
              padding: "0.75rem 1.25rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
