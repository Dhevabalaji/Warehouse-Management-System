import { ScanLine } from "lucide-react";
import PlaceholderPage from "../shared/PlaceholderPage";

export default function StaffBarcodeScanner() {
  return (
    <PlaceholderPage title="Barcode Scanner" subtitle="Scan barcode or QR code">
      <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <ScanLine size={90} className="text-primary" />

        <h2 className="mt-5 text-xl font-bold">Scanner Preview</h2>

        <p className="text-slate-500 mt-2 text-center max-w-md">
          Camera-based barcode scanning will be connected later using scanner
          library.
        </p>

        <button className="btn-primary mt-6">Start Scanner</button>
      </div>
    </PlaceholderPage>
  );
}