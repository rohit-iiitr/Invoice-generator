// import { Router } from "express"
// import {
//   getProducts,
//   getProduct,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   getProductCategories,
// } from "../controllers/productController"
// import { authenticate } from "../middleware/auth"
// import { validateProduct, validateObjectId, validatePagination, handleValidationErrors } from "../middleware/validation"

// const router = Router()

// // All routes require authentication
// router.use(authenticate)

// // Product routes
// router.get("/", validatePagination, handleValidationErrors, getProducts)
// router.get("/categories", getProductCategories)
// router.get("/:id", validateObjectId("id"), handleValidationErrors, getProduct)
// router.post("/", validateProduct, handleValidationErrors, createProduct)
// router.put("/:id", validateObjectId("id"), validateProduct, handleValidationErrors, updateProduct)
// router.delete("/:id", validateObjectId("id"), handleValidationErrors, deleteProduct)
// router.post("/generate-pdf", validateObjectId("id"), handleValidationErrors, async (req, res) => {
// export default router

import express from 'express'
import { getProducts } from '../controllers/getProducts.controller';
import { addProducts } from '../controllers/addProducts.controller';
import { generatePdf } from '../controllers/generatePdf.controller';

const router = express.Router();

router.get('/:userId/get', getProducts);
router.post('/:userId/add', addProducts);
router.post('/generate-pdf', generatePdf);

export default router;