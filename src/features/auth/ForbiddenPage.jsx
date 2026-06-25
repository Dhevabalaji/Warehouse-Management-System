import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="card p-10 text-center max-w-md">
        <h1 className="text-5xl font-bold text-danger">403</h1>
        <p className="mt-4 text-xl font-semibold">Access Denied</p>
        <p className="mt-2 text-muted">
          You do not have permission to access this page.
        </p>
        <Link to="/login" className="btn-primary inline-block mt-6">
          Back to Login
        </Link>
      </div>
    </div>
  );
}