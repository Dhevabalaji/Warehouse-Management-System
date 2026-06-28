import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-content-bg">
      <div className="content-card p-8 text-center">
        <h1 className="text-5xl font-bold text-red-600">403</h1>
        <p className="mt-3 text-slate-500">You do not have access.</p>
        <Link to="/login" className="btn-primary mt-6">
          Back to Login
        </Link>
      </div>
    </div>
  );
}