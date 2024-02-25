const express = require("express");
const router = express.Router();
const userController = require("../controllers/User.controller.js");


router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserByid);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router