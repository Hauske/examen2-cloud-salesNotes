import { Router } from "express";
import saleNoteRoutes from "./saleNoteRoutes";

const router = Router();
router.use("/sales-notes", saleNoteRoutes);

export default router;