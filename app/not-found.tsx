import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
      <p className="font-display text-6xl tracking-tight text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl tracking-tight">
        This page took a wrong turn
      </h1>
      <p className="mt-3 text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wide text-accent-contrast transition-colors hover:bg-tpc-white hover:text-tpc-black"
        >
          Back home
        </Link>
        <Link
          href="/shop"
          className="border border-border px-5 py-3 text-sm font-semibold"
        >
          Shop all
        </Link>
      </div>
    </div>
  );
}
