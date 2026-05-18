import type { UserRole } from "./auth.types";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";

export type LeadSource = "Website" | "Instagram" | "Referral";

export type LeadSortOption = "latest" | "oldest";

export interface CreatedBy {
    _id: string,
    email: string,
    name: string,
    role: UserRole
}

export interface Lead {
    _id: string,
    name: string,
    email: string,
    source: LeadSource,
    status: LeadStatus,
    createdBy: CreatedBy,
    createdAt: string,
    updatedAt: string
}

export interface LeadFormInput {
    name: string,
    email: string,
    source: LeadSource,
    status: LeadStatus
}

export interface LeadFilters {
    status?: LeadStatus | "",
    source?: LeadSource | "",
    search?: string,
    sort?: LeadSortOption,
    page?: number
}

export interface LeadsResponse {
    success: boolean;
    message: string;
    data: {
        leads: Lead[];
        pagination: {
            totalRecords: number;
            currentPage: number;
            totalPages: number;
            limit: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
        appliedFilters: {
            status: string | null;
            source: string | null;
            search: string | null;
            sort: LeadSortOption;
        };
    };
}