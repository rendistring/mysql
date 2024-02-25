const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/Wishlist.controller.js");
const middleware = require("../middleware/verifyToken.js");

router.post('/add', middleware.verifyToken, wishlistController.addToWishlist);
router.delete('/remove/:wishlistItemId', wishlistController.removeFromWishlist);

module.exports = router;