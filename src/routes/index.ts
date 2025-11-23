import { Router } from "express";
import saleNoteRoutes from "./saleNoteRoutes";
import metricsMiddleware from "../middlewares/metricsMiddleware";

const router = Router();
router.use("/sales-notes", metricsMiddleware(), saleNoteRoutes);

export default router;