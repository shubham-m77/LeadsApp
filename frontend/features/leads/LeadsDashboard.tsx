import {
    Download,
    Eye,
    Loader2,
    Pencil,
    Plus,
    Search,
    Trash2
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { leadsApi } from "../../api/leads.api";
import type {
    Lead,
    LeadFilters,
    LeadFormInput,
    LeadSource,
    LeadStatus
} from "../../types/lead.types";
import { saveAs } from "file-saver";
import { LeadDetailsModal } from "./LeadDetailsModal";
import { LeadFormModal } from "./LeadFormModal";
import { useDebounce } from "../../hooks/useDebounce";
import { getApiError } from "../../utils/ApiError";

const statusOptions: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
const sourceOptions: LeadSource[] = ["Website", "Instagram", "Referral"];

export const LeadsDashboard = () => {
    const userRole = localStorage.getItem("smart_leads_user_role");

    const [leads, setLeads] = useState<Lead[]>([]);
    const [filters, setFilters] = useState<LeadFilters>({
        status: "",
        source: "",
        search: "",
        sort: "latest",
        page: 1
    });

    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const debouncedSearch = useDebounce(filters.search, 500);

    const queryFilters = useMemo<LeadFilters>(() => {
        return {
            status: filters.status || undefined,
            source: filters.source || undefined,
            search: debouncedSearch || undefined,
            sort: filters.sort,
            page: filters.page
        };
    }, [
        filters.status,
        filters.source,
        filters.sort,
        filters.page,
        debouncedSearch
    ]);

    const fetchLeads = async () => {
        try {
            setIsLoading(true);
            setApiError("");

            const response = await leadsApi.getLeads(queryFilters);

            setLeads(response.data.leads);
            setTotalRecords(response.data.pagination.totalRecords);
            setCurrentPage(response.data.pagination.currentPage);
            setTotalPages(response.data.pagination.totalPages || 1);
            setHasNextPage(response.data.pagination.hasNextPage);
            setHasPrevPage(response.data.pagination.hasPrevPage);
        } catch (error) {
            setApiError(getApiError(error));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryFilters]);

    const updateFilter = <K extends keyof LeadFilters>(
        key: K,
        value: LeadFilters[K]
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: key === "page" ? Number(value) : 1
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            status: "",
            source: "",
            search: "",
            sort: "latest",
            page: 1
        });
    };
    const openCreateModal = () => {
        setActionError("");
        setSelectedLead(null);
        setFormMode("create");
        setIsFormModalOpen(true);
    };

    const openEditModal = (lead: Lead) => {
        setActionError("");
        setSelectedLead(lead);
        setFormMode("edit");
        setIsFormModalOpen(true);
    };

    const openDetailsModal = (lead: Lead) => {
        setSelectedLead(lead);
        setIsDetailsModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedLead(null);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedLead(null);
    };

    const handleSubmitLead = async (data: LeadFormInput) => {
        try {
            setIsSubmitting(true);
            setActionError("");

            if (formMode === "create") {
                await leadsApi.createLead(data);
            } else if (selectedLead) {
                await leadsApi.updateLead(selectedLead._id, data);
            }

            closeFormModal();
            await fetchLeads();
        } catch (error) {
            setActionError(getApiError(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteLead = async (lead: Lead) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${lead.name}?`
        );

        if (!confirmed) return;

        try {
            setActionError("");
            await leadsApi.deleteLead(lead._id);
            await fetchLeads();
        } catch (error) {
            setActionError(getApiError(error));
        }
    };

    const handleExportCsv = async () => {
        try {
            setActionError("");

            const blob = await leadsApi.exportCsv({
                status: filters.status || undefined,
                source: filters.source || undefined,
                search: debouncedSearch || undefined,
                sort: filters.sort
            });

            saveAs(blob, `leads-export-${Date.now()}.csv`);
        } catch (error) {
            setActionError(getApiError(error));
        }
    };

    return (<>
        <div className="space-y-6">
            <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Leads</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage, filter, and track all customer leads in one place.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleExportCsv}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <Plus size={16} />
                        Add Lead
                    </button>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Search
                        </label>

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={filters.search || ""}
                                onChange={(event) =>
                                    updateFilter("search", event.target.value)
                                }
                                placeholder="Search name or email"
                                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Status
                        </label>

                        <select
                            value={filters.status || ""}
                            onChange={(event) =>
                                updateFilter("status", event.target.value as LeadStatus | "")
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="">All Status</option>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Source
                        </label>

                        <select
                            value={filters.source || ""}
                            onChange={(event) =>
                                updateFilter("source", event.target.value as LeadSource | "")
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="">All Sources</option>
                            {sourceOptions.map((source) => (
                                <option key={source} value={source}>
                                    {source}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Sort
                        </label>

                        <select
                            value={filters.sort || "latest"}
                            onChange={(event) =>
                                updateFilter(
                                    "sort",
                                    event.target.value as LeadFilters["sort"]
                                )
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="latest">Latest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900">{leads.length}</span>{" "}
                        of <span className="font-medium text-slate-900">{totalRecords}</span>{" "}
                        leads
                    </p>

                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Clear Filters
                    </button>
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {(apiError || actionError) && (
                    <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {apiError || actionError}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex min-h-72 items-center justify-center">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Loader2 size={18} className="animate-spin" />
                            Loading leads...
                        </div>
                    </div>
                ) : leads.length === 0 ? (
                    <div className="flex min-h-72 flex-col items-center justify-center px-4 text-center">
                        <div className="rounded-full bg-slate-100 p-4">
                            <Search size={28} className="text-slate-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            No leads found
                        </h3>
                        <p className="mt-1 max-w-md text-sm text-slate-500">
                            Try changing your filters or add a new lead to get started.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Lead
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Source
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Created By
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Created At
                                        </th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {leads.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-slate-900">
                                                    {lead.name}
                                                </p>
                                                <p className="text-sm text-slate-500">{lead.email}</p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge status={lead.status} />
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-700">
                                                {lead.source}
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-slate-900">
                                                    {lead.createdBy?.name || "N/A"}
                                                </p>
                                                <p className="text-xs capitalize text-slate-500">
                                                    {lead.createdBy?.role || "N/A"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openDetailsModal(lead)}
                                                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(lead)}
                                                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    {userRole === "admin" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteLead(lead)}
                                                            className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row">
                            <p className="text-sm text-slate-500">
                                Page{" "}
                                <span className="font-medium text-slate-900">
                                    {currentPage}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-slate-900">
                                    {totalPages}
                                </span>
                            </p>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={!hasPrevPage}
                                    onClick={() => updateFilter("page", currentPage - 1)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    disabled={!hasNextPage}
                                    onClick={() => updateFilter("page", currentPage + 1)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </div>
        <LeadFormModal
            isOpen={isFormModalOpen}
            mode={formMode}
            selectedLead={selectedLead}
            isSubmitting={isSubmitting}
            onClose={closeFormModal}
            onSubmit={handleSubmitLead}
        />

        <LeadDetailsModal
            isOpen={isDetailsModalOpen}
            lead={selectedLead}
            onClose={closeDetailsModal}
        />
    </>
    );
};

interface StatusBadgeProps {
    status: LeadStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const styles: Record<LeadStatus, string> = {
        New: "bg-blue-50 text-blue-700 border-blue-200",
        Contacted: "bg-amber-50 text-amber-700 border-amber-200",
        Qualified: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Lost: "bg-red-50 text-red-700 border-red-200"
    };

    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
        >
            {status}
        </span>
    );
};