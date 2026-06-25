import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addStorageItem } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function CreateProductPage() {
  const { user } = useAuthContext();

  const [product, setProduct] = useState({
    name: "",
    sku: "",
    category: "",
    qty: "",
    minQty: "",
    price: "",
    location: "",
    supplier: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      tenantId: user?.tenantId,
      companyCode: user?.companyCode,
      status: Number(product.qty) <= Number(product.minQty) ? "Low Stock" : "In Stock",
      ...product,
      qty: Number(product.qty),
      minQty: Number(product.minQty),
      price: Number(product.price),
    };

    addStorageItem("wms_inventory", newProduct);

    alert("Product added successfully");

    setProduct({
      name: "",
      sku: "",
      category: "",
      qty: "",
      minQty: "",
      price: "",
      location: "",
      supplier: "",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Create Product</h1>
      <p className="text-muted mt-1">Add new product into warehouse inventory</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input" placeholder="Product Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
          <input className="input" placeholder="SKU Code" value={product.sku} onChange={(e) => setProduct({ ...product, sku: e.target.value })} required />
          <input className="input" placeholder="Category" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} required />
          <input className="input" type="number" placeholder="Quantity" value={product.qty} onChange={(e) => setProduct({ ...product, qty: e.target.value })} required />
          <input className="input" type="number" placeholder="Minimum Quantity" value={product.minQty} onChange={(e) => setProduct({ ...product, minQty: e.target.value })} required />
          <input className="input" type="number" placeholder="Price" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
          <input className="input" placeholder="Location / Rack" value={product.location} onChange={(e) => setProduct({ ...product, location: e.target.value })} required />
          <input className="input" placeholder="Supplier" value={product.supplier} onChange={(e) => setProduct({ ...product, supplier: e.target.value })} required />
        </div>

        <button className="btn-primary mt-5">Add Product</button>
      </form>
    </DashboardLayout>
  );
}