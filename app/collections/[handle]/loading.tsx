import { CollectionSkeleton } from "@/components/collection/CollectionSkeleton";

export default function Loading() {
  return (
    <div>
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="h-4 w-32 animate-pulse bg-black/5" />
          <div className="mt-4 h-10 w-64 animate-pulse bg-black/5" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <CollectionSkeleton />
      </div>
    </div>
  );
}
