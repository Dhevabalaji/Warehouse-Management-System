import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="card p-10 text-center max-w-md">
        <h1 className="text-5xl font-bold text-navy">404</h1>
        <p className="mt-4 text-xl font-semibold">Page Not Found</p>
        <p className="mt-2 text-muted">
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="btn-primary inline-block mt-6">
          Go Home
        </Link>
      </div>
    </div>
  );
}