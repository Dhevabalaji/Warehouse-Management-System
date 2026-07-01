import { ScanLine } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ScannerPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Barcode Scanner</h1>
      <p className="text-muted mt-1">Scan product barcode or QR code</p>

      <div className="card p-8 mt-8 max-w-3xl text-center">
        <div className="mx-auto w-72 h-72 border-4 border-dashed border-slate-300 rounded-3xl flex items-center justify-center bg-slate-100">
          <ScanLine size={90} className="text-navy" />
        </div>

        <h2 className="text-xl font-bold text-navy mt-6">Scanner Preview</h2>
        <p className="text-muted mt-2">
          Camera scanner integration can be connected later using a barcode library.
        </p>

        <button className="btn-primary mt-6">Start Scanner</button>
      </div>
    </DashboardLayout>
  );
}