const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();


exports.getWishlistByid = async (req, res) => {
  const {id} = req.params;
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        id
      }
    })
    res.status(200).json(wishlist);
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
}
exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    // Cek apakah produk sudah ada di wishlist
    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingItem) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: userId,
        productId: productId,
      },
    });
    res.json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { wishlistId } = req.params;
  try {
    await prisma.wishlist.delete({
      where: {
        id: parseInt(wishlistId),
      },
    });
    res.status(204).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to remove item from wishlist',
    });
  }
};