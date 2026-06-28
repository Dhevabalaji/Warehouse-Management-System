import { Loader2 } from "lucide-react";

export default function PageLoader({ text = "Loading..." }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
      <Loader2 size={36} className="animate-spin text-yellow-400" />
      <p className="mt-4 text-sm">{text}</p>
    </div>
  );
}