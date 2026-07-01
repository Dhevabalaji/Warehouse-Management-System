import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState({
    companyName: "WMS Pro Logistics",
    companyCode: "WMSPRO",
    email: "admin@wms.io",
    phone: "+91 9876543210",
    address: "Chennai, Tamil Nadu",
  });

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Company Profile</h1>

      <div className="card p-6 mt-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="input"
            value={company.companyName}
            onChange={(e) =>
              setCompany({ ...company, companyName: e.target.value })
            }
          />

          <input
            className="input"
            value={company.companyCode}
            onChange={(e) =>
              setCompany({ ...company, companyCode: e.target.value })
            }
          />

          <input
            className="input"
            value={company.email}
            onChange={(e) =>
              setCompany({ ...company, email: e.target.value })
            }
          />

          <input
            className="input"
            value={company.phone}
            onChange={(e) =>
              setCompany({ ...company, phone: e.target.value })
            }
          />
        </div>

        <textarea
          rows="4"
          className="input mt-4"
          value={company.address}
          onChange={(e) =>
            setCompany({ ...company, address: e.target.value })
          }
        />

        <button className="btn-primary mt-5">
          Save Company Profile
        </button>
      </div>
    </DashboardLayout>
  );
}