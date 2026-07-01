import Skeleton from "./Skeleton.jsx";

export default function TableSkeleton({ rows = 6 }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <Skeleton className="h-10 w-60 mb-5" />

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}