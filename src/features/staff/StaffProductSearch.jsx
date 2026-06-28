import PlaceholderPage from "../shared/PlaceholderPage";

export default function StaffProductSearch() {
  return (
    <PlaceholderPage
      title="Product Search"
      subtitle="Search product by name or SKU"
    >
      <input className="form-input max-w-xl mb-6" placeholder="Search product..." />

      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Location</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Safety Helmet</td>
            <td>SKU-1001</td>
            <td>A1-01</td>
            <td>120</td>
          </tr>

          <tr>
            <td>Barcode Rolls</td>
            <td>SKU-1002</td>
            <td>B2-04</td>
            <td>8</td>
          </tr>
        </tbody>
      </table>
    </PlaceholderPage>
  );
}