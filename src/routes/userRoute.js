import { Router } from "express";
import { signInValidation, signUpValidation } from "../middlewares/userValidationMiddleware.js";
import { signIn, signUp } from "../controllers/userController.js";

const router = Router();

router.post("/sign-in", signInValidation, signIn);
router.post("/sign-up", signUpValidation, signUp);

export default router;