import { Router } from "express";
import saleNoteController from "../controllers/saleNoteController";

const router = Router()

router.get('/', saleNoteController.getSalesNotes);
router.get('/:id', saleNoteController.getSaleNoteById);
router.post('/', saleNoteController.createSaleNote);
//router.put('/:id', saleNoteController.updateSaleNote);
router.delete('/:id', saleNoteController.deleteSaleNote);
router.get('/:rfc/:folio', saleNoteController.getPDF);

export default router;
