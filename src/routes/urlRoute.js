import express from "express";
import { urlPost } from "../controllers/urlController.js";
import { urlValidation } from "../middlewares/urlValidationMiddleware.js";

const router = express.Router();

router.post("/urls/shorten", urlValidation, urlPost);

export default router;