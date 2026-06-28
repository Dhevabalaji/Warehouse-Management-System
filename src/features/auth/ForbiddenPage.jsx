import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center rounded-3xl bg-white/5 border border-white/10 p-8">
        <h1 className="text-6xl font-black text-yellow-400">403</h1>
        <h2 className="text-2xl font-bold mt-4">Access Denied</h2>
        <p className="text-slate-400 mt-3">
          You do not have permission to access this page.
        </p>
        <Link
          to="/login"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-yellow-400 text-slate-950 font-bold"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}