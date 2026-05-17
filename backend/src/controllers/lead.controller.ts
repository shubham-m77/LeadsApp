import { success } from "zod";
import { Lead } from "../models/lead.model";
import { AppError } from "../utils/AppError"
import { createLeadSchema, updateLeadSchema } from "../validations/lead.validation"

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

export const getLeads = async (req: Request, res: Response): Promise<Response>=>{
    const leads = await Lead.find().populate("createdBy","name email role").sort({ createdAt: -1 });
    return res.status(200).json({
        success: true,
        message: "Leads fetched  successfully",
        results:leads.length,
        leads
    });
    
}

export const getSingleLead = async (req: Request, res: Response): Promise<Response>=>{
    const {id} = req.params;
    const lead = await Lead.findById(id).populate("createdBy","name role email")
    if(!lead){
        throw new AppError("lead not found",401)
    }
    res.status(200).json({
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