import { Router } from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware";
import { registerUserController,loginUserController, getMe, adminController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/get-me",protect,getMe);
router.get("/admin-only", protect, authorizeRoles("admin"), adminController);

export default router;