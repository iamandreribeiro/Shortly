import express from "express";
import { urlPost, getUrlById, getShortenUrlById } from "../controllers/urlController.js";
import { urlValidation, urlExist, shortenUrlExist } from "../middlewares/urlValidationMiddleware.js";

const router = express.Router();

router.post("/urls/shorten", urlValidation, urlPost);
router.get("/urls/:id", urlExist, getUrlById);
router.get("/urls/open/:shortUrl", shortenUrlExist, getShortenUrlById);

export default router;