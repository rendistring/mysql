// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {  addItemToCart, removeItemFromCart } = require('../controllers/Cart.controller.js');

router.post('/add', addItemToCart);

// Route untuk menghapus item dari cart
router.delete('/remove/:cartItemId', removeItemFromCart);

module.exports = router;