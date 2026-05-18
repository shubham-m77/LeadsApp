export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";

export type LeadSource = "Website" | "Instagram" | "Referral";

export type LeadSortOption = "latest" | "oldest";

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string;
}

export interface LeadQueryParams {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: LeadSortOption;
  page?: string;
}