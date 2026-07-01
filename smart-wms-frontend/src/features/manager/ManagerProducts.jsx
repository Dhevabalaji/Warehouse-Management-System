import PlaceholderPage from "../shared/PlaceholderPage";

export default function ManagerProducts() {
  return (
    <PlaceholderPage
      title="Products"
      subtitle="Product catalog and SKU management"
    >
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Safety Helmet</td>
            <td>SKU-1001</td>
            <td>Safety</td>
            <td>120</td>
            <td><span className="badge-success">In Stock</span></td>
          </tr>

          <tr>
            <td>Barcode Rolls</td>
            <td>SKU-1002</td>
            <td>Labeling</td>
            <td>8</td>
            <td><span className="badge-warning">Low Stock</span></td>
          </tr>
        </tbody>
      </table>
    </PlaceholderPage>
  );
}