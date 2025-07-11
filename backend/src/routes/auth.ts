import { Router } from "express"
import { register, login, getProfile, updateProfile } from "../controllers/authController"
import { authenticate } from "../middleware/auth"
import { validateRegister, validateLogin, handleValidationErrors } from "../middleware/validation"


const router = Router()

// Public routes
router.post("/register", validateRegister, handleValidationErrors, register)
router.post("/login",  validateLogin, handleValidationErrors, login)

// Protected routes
router.get("/profile", authenticate, getProfile)
router.put("/profile", authenticate, updateProfile)

export default router
