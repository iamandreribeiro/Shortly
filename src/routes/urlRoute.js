import express from "express";
import { urlPost, getUrlById, getShortenUrlById, deleteUrl, generateRanking } from "../controllers/urlController.js";
import { urlValidation, urlExist, shortenUrlExist, urlDeleteValidation } from "../middlewares/urlValidationMiddleware.js";

const router = express.Router();

router.post("/urls/shorten", urlValidation, urlPost);
router.get("/urls/:id", urlExist, getUrlById);
router.get("/urls/open/:shortUrl", shortenUrlExist, getShortenUrlById);
router.delete("/urls/:id", urlDeleteValidation, deleteUrl);
router.get("/ranking", generateRanking);

export default router;