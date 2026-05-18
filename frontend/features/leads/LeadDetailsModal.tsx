import { X } from "lucide-react";
import type { Lead } from "../../types/lead.types";

interface LeadDetailsModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailsModal = ({
  isOpen,
  lead,
  onClose
}: LeadDetailsModalProps) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 overflow-y-scroll">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl ">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Lead Details
            </h3>
            <p className="text-sm text-slate-500">
              Complete information about selected lead.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <DetailItem label="Name" value={lead.name} />
          <DetailItem label="Email" value={lead.email} />
          <DetailItem label="Status" value={lead.status} />
          <DetailItem label="Source" value={lead.source} />
          <DetailItem label="Created By" value={lead.createdBy?.name || "N/A"} />
          <DetailItem
            label="Created By Email"
            value={lead.createdBy?.email || "N/A"}
          />
          <DetailItem
            label="Created At"
            value={new Date(lead.createdAt).toLocaleString()}
          />
          <DetailItem
            label="Last Updated"
            value={new Date(lead.updatedAt).toLocaleString()}
          />
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
};