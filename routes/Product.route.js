const express = require("express");
const router = express.Router();
const productController = require("../controllers/Product.controller.js");


router.get("/", productController.getAllProducts);
router.get("/all", productController.Products);
router.get("/:id", productController.getProductByid);
router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router
