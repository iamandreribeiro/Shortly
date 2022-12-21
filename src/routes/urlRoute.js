import express from "express";
import { urlPost, getUrlById } from "../controllers/urlController.js";
import { urlValidation, urlExist } from "../middlewares/urlValidationMiddleware.js";

const router = express.Router();

router.post("/urls/shorten", urlValidation, urlPost);
router.get("/urls/:id", urlExist, getUrlById);

export default router;