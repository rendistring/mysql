const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/Categories.controller.js");


router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoriesByid);
router.post("/", categoriesController.createCategories);
router.patch("/:id", categoriesController.updateCategories);
router.delete("/:id", categoriesController.deleteCategories);

module.exports = router