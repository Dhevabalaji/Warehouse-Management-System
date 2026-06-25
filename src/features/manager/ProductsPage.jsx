import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage, setStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function ProductsPage() {
  const { user } = useAuthContext();

  const [editingProduct, setEditingProduct] = useState(null);

  const products = getStorage("wms_inventory", []).filter(
    (item) => item.companyCode === user?.companyCode
  );

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const allProducts = getStorage("wms_inventory", []);
    const updatedProducts = allProducts.filter((product) => product.id !== id);

    setStorage("wms_inventory", updatedProducts);
    window.location.reload();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const allProducts = getStorage("wms_inventory", []);

    const updatedProducts = allProducts.map((product) =>
      product.id === editingProduct.id
        ? {
            ...editingProduct,
            qty: Number(editingProduct.qty),
            minQty: Number(editingProduct.minQty),
            price: Number(editingProduct.price),
          }
        : product
    );

    setStorage("wms_inventory", updatedProducts);
    setEditingProduct(null);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Products</h1>
      <p className="text-muted mt-1">View, edit, and delete inventory products</p>

      {editingProduct && (
        <form onSubmit={handleEditSubmit} className="card p-6 mt-8">
          <h2 className="text-xl font-bold text-navy mb-5">Edit Product</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input className="input" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
            <input className="input" value={editingProduct.sku} onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })} />
            <input className="input" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} />
            <input className="input" type="number" value={editingProduct.qty} onChange={(e) => setEditingProduct({ ...editingProduct, qty: e.target.value })} />
            <input className="input" type="number" value={editingProduct.minQty} onChange={(e) => setEditingProduct({ ...editingProduct, minQty: e.target.value })} />
            <input className="input" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
            <input className="input" value={editingProduct.location} onChange={(e) => setEditingProduct({ ...editingProduct, location: e.target.value })} />
            <input className="input" value={editingProduct.supplier} onChange={(e) => setEditingProduct({ ...editingProduct, supplier: e.target.value })} />
          </div>

          <div className="flex gap-3 mt-5">
            <button className="btn-primary">Save Changes</button>
            <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl border">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card p-6 mt-8 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted border-b">
              <th className="py-3">Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Location</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => {
              const isLow = Number(p.qty) <= Number(p.minQty);
              const isOut = Number(p.qty) === 0;

              return (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-4 font-semibold">{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.category}</td>
                  <td>{p.qty}</td>
                  <td>{p.location}</td>
                  <td>{p.supplier}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isOut
                          ? "bg-red-100 text-danger"
                          : isLow
                          ? "bg-yellow-100 text-warning"
                          : "bg-green/10 text-green"
                      }`}
                    >
                      {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button onClick={() => setEditingProduct(p)} className="px-3 py-1 rounded-lg bg-navy text-white text-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="px-3 py-1 rounded-lg bg-danger text-white text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}