import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addStorageItem } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function CreateSupplierPage() {
  const { user } = useAuthContext();

  const [supplier, setSupplier] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    category: "",
    address: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSupplier = {
      id: Date.now(),
      tenantId: user?.tenantId,
      companyCode: user?.companyCode,
      orders: 0,
      onTime: "0%",
      rating: 0,
      status: "Active",
      ...supplier,
    };

    addStorageItem("wms_suppliers", newSupplier);

    alert("Supplier added successfully");

    setSupplier({
      name: "",
      contact: "",
      email: "",
      phone: "",
      category: "",
      address: "",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Create Supplier</h1>
      <p className="text-muted mt-1">Add supplier details for purchase orders</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input" placeholder="Supplier Name" value={supplier.name} onChange={(e) => setSupplier({ ...supplier, name: e.target.value })} required />
          <input className="input" placeholder="Contact Person" value={supplier.contact} onChange={(e) => setSupplier({ ...supplier, contact: e.target.value })} required />
          <input className="input" type="email" placeholder="Email" value={supplier.email} onChange={(e) => setSupplier({ ...supplier, email: e.target.value })} required />
          <input className="input" placeholder="Phone" value={supplier.phone} onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })} required />
          <input className="input" placeholder="Category" value={supplier.category} onChange={(e) => setSupplier({ ...supplier, category: e.target.value })} required />
        </div>

        <textarea
          className="input mt-4"
          rows="4"
          placeholder="Supplier Address"
          value={supplier.address}
          onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
          required
        />

        <button className="btn-primary mt-5">Add Supplier</button>
      </form>
    </DashboardLayout>
  );
}