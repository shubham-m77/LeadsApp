import { success } from "zod";
import { Lead } from "../models/lead.model";
import { AppError } from "../utils/AppError"
import { LeadQueryParams } from "../types/leads.types";
import { createLeadSchema, leadQuerySchema, updateLeadSchema } from "../validations/lead.validation"
import { Parser } from "json2csv";

export const createLeadController =  async (req: Request, res: Response): Promise<Response>=>{
    const data = createLeadSchema.parse(req.body);
    if (!data) {
        throw new AppError("Data not recieved!", 403);
    }
    if(!req.user){
        throw new AppError("User not found!", 404)
    }
    try {
        const lead = await Lead.create({
            ...data,
            status: data.status || "New",
            createdBy: req.user.userId,

        })
        return res.status(201).json({
            success: true,
            message: "Lead created successfully",
            lead
        })
    } catch (error) {
        throw new AppError("Error creating lead!", 500)
    }
}

export const getLeads =  async (req: Request, res: Response): Promise<void> => {
    const {
      status,
      source,
      search,
      sort = "latest",
      page = "1"
    } = req.query as LeadQueryParams;

    const limit = 10;
    const currentPage = Math.max(Number(page) || 1, 1);
    const skip = (currentPage - 1) * limit;

    const query: Record<string, unknown> = {};

    if (status && typeof status === "string") {
      query.status = status;
    }

    if (source && typeof source === "string") {
      query.source = source;
    }

    if (search && typeof search === "string") {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          email: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const sortOption =
      sort === "oldest" ? { createdAt: 1 as const } : { createdAt: -1 as const };

    const totalLeads = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .populate("createdBy", "name email role")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalLeads / limit);

    res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: {
        leads,
        pagination: {
          totalRecords: totalLeads,
          currentPage,
          totalPages,
          limit,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1
        },
        filters: {
          status: status || null,
          source: source || null,
          search: search || null,
          sort
        }
      }
    });
  }

export const getSingleLead = async (req: Request, res: Response): Promise<Response>=>{
    const {id} = req.params;
    const lead = await Lead.findById(id).populate("createdBy","name role email")
    if(!lead){
        throw new AppError("lead not found",401)
    }
   return res.status(200).json({
        success:true,
        message:"Lead fetched successfully!",
        lead
    })
}

export const updateLead = async (req: Request, res: Response): Promise<Response>=>{
    const {id} = req.params;
    const data = updateLeadSchema.parse(req.body);
    if (!data) {
        throw new AppError("Data not recieved!", 403);
    }
    const updatedLead = await Lead.findByIdAndUpdate(id, data, { new: true,runValidators:true });
     if (!updatedLead) {
      throw new AppError("Lead not found", 404);
    }
    return res.status(200).json({
        success: true,
        message: "Lead updated successfully",
        lead: updatedLead
    });
}

export const deleteLead = async (req: Request, res: Response): Promise<Response>=>{
    const {id} = req.params;
    const deletedLead = await Lead.findByIdAndDelete(id);
    if (!deletedLead) {
        throw new AppError("Lead not found", 404);
      }
      return res.status(200).json({
          success: true,
          message: "Lead deleted successfully"
      });
}

export const exportLeadsToCSV = 
  async (req: Request, res: Response): Promise<Response> => {
    const {
      status,
      source,
      search,
      sort = "latest"
    } = leadQuerySchema
      .omit({
        page: true
      })
      .parse(req.query);

    const query: Record<string, unknown> = {};

    if (status) {2
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          email: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const sortOption =
      sort === "oldest" ? { createdAt: 1 as const } : { createdAt: -1 as const };

    const leads = await Lead.find(query)
      .populate("createdBy", "name email role")
      .sort(sortOption)
      .lean();

    if (leads.length === 0) {
      throw new AppError("No leads found to export", 404);
    }

    const formattedLeads = leads.map((lead) => {
      const createdBy = lead.createdBy as unknown as {
        name?: string;
        email?: string;
        role?: string;
      };

      return {
        Name: lead.name,
        Email: lead.email,
        Status: lead.status,
        Source: lead.source,
        "Created By": createdBy?.name || "N/A",
        "Created By Email": createdBy?.email || "N/A",
        "Created By Role": createdBy?.role || "N/A",
        "Created At": lead.createdAt
          ? new Date(lead.createdAt).toLocaleString()
          : "N/A"
      };
    });

    const fields = [
      "Name",
      "Email",
      "Status",
      "Source",
      "Created By",
      "Created By Email",
      "Created By Role",
      "Created At"
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(formattedLeads);

    const fileName = `leads-export-${Date.now()}.csv`;

    res.header("Content-Type", "text/csv");
    res.attachment(fileName);
    return res.status(200).send(csv);
  }