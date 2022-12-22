import express from "express";
import { signInValidation, signUpValidation, usersValidation } from "../middlewares/userValidationMiddleware.js";
import { signIn, signUp, getUsersLink } from "../controllers/userController.js";

const router = express.Router();

router.post("/sign-in", signInValidation, signIn);
router.post("/sign-up", signUpValidation, signUp);
router.get("/users/me", usersValidation, getUsersLink);

export default router;