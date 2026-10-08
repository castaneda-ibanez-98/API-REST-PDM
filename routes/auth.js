import express from "express";
import { login,forgotCheckBoleta,forgotCheckEmail,forgotReset } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/forgot/check-email", forgotCheckEmail);
router.post("/forgot/check-boleta", forgotCheckBoleta);
router.post("/forgot/reset", forgotReset);
export default router; 
