import DashboardLayout from "../../layouts/DashboardLayout";
import useAuthContext from "../../hooks/useAuthContext";

export default function ProfilePage() {
  const { user } = useAuthContext();

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Profile</h1>

      <div className="card p-8 mt-8 max-w-3xl">
        <div className="space-y-5">
          <div>
            <label className="text-sm text-muted">Name</label>
            <input
              className="input mt-2"
              value={user?.name || ""}
              readOnly
            />
          </div>

          <div>
            <label className="text-sm text-muted">Email</label>
            <input
              className="input mt-2"
              value={user?.email || ""}
              readOnly
            />
          </div>

          <div>
            <label className="text-sm text-muted">Role</label>
            <input
              className="input mt-2"
              value={user?.role || ""}
              readOnly
            />
          </div>

          <div>
            <label className="text-sm text-muted">Company Code</label>
            <input
              className="input mt-2"
              value={user?.companyCode || ""}
              readOnly
            />
          </div>

          <button className="btn-primary">
            Update Profile
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}