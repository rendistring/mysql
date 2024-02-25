const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth.controller.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.delete("/logout", authController.logout);
router.get("/token",  authController.refreshToken);

module.exports = router