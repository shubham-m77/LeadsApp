import { api } from "./axios"
import {Lead, LeadFilters, LeadFormInput, LeadsResponse} from "../types/lead.types"
interface singleLeadResponse{
    success:boolean,
    message:string,
    lead:Lead
}
export const leadsApi = {
    getLeads:async(filters:LeadFilters):Promise<LeadsResponse> => {
        const response = await api.get<LeadsResponse>("/leads",{
            params:filters
        })
        return response.data;
    },

    getLeadsById:async(id:string):Promise<singleLeadResponse> => {
        const response = await api.get<singleLeadResponse>(`/leads/${id}`);
        return response.data;
    },

    createLead: async(data:LeadFormInput):Promise<singleLeadResponse> => {
        const res =  await api.post<singleLeadResponse>("/leads",data);
        return res.data;
    },

    updateLead: async(id:string,data:Partial<LeadFormInput>):Promise<singleLeadResponse> => {
        const res =  await api.patch<singleLeadResponse>(`/leads/${id}`,data);
        return res.data;
    },

    deleteLead: async(id:string):Promise<{success:boolean;message:string}> => {
        const res = await api.delete<{success:boolean;message:string}>(`/leads/${id}`);
        return res.data;
    },

    exportCsv: async(filters:Omit<LeadFilters,"page">):Promise<Blob> => {
        const response = await api.get<Blob>("/leads/export/csv",{
            params:filters,
            responseType:"blob"
        })
        return response.data;
    }
}