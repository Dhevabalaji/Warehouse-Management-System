import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-content-bg">
      <div className="content-card p-8 text-center">
        <h1 className="text-5xl font-bold text-slate-900">404</h1>
        <p className="mt-3 text-slate-500">Page not found</p>
        <Link to="/" className="btn-primary mt-6">
          Go Home
        </Link>
      </div>
    </div>
  );
}