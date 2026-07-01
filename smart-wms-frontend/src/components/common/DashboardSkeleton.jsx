import Skeleton from "./Skeleton.jsx";

export default function DashboardSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-72 mb-4" />
      <Skeleton className="h-5 w-96 mb-8" />

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>

      <Skeleton className="h-80 w-full" />
    </div>
  );
}