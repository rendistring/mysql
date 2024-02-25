const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

exports.addItemToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await prisma.cart.upsert({
      where: { userId: userId },
      update: {
        items: {
          create: { productId: productId, quantity: quantity },
        },
      },
      create: {
        userId: userId,
        items: {
          create: [{ productId: productId, quantity: quantity }],
        },
      },
      include: {
        items: true,
      },
    });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to add item to cart", error: error.message });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { cartItemId } = req.params;
  try {
    await prisma.cartItem.delete({
      where: { id: parseInt(cartItemId) },
    });
    res.status(204).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item from cart", error: error.message });
  }
};