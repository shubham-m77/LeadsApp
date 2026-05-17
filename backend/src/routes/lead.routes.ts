import { Router } from "express";
import { createLeadController, deleteLead, getLeads, getSingleLead, updateLead } from "../controllers/lead.controller";
import { authorizeRoles, protect } from "../middlewares/auth.middleware";

const router = Router();
router.use(protect)

router.route("/").post(createLeadController).get(getLeads);
router.route("/:id").get(getSingleLead).patch(updateLead).delete(authorizeRoles('admin'),deleteLead);

export default router;