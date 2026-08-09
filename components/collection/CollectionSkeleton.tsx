export function CollectionSkeleton() {
  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
      <div className="hidden lg:block">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse bg-black/5" />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-6 h-8 w-40 animate-pulse bg-black/5" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[4/5] animate-pulse bg-black/5" />
              <div className="mt-3 h-3 w-3/4 animate-pulse bg-black/5" />
              <div className="mt-2 h-3 w-1/3 animate-pulse bg-black/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
