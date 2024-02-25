const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany();
    if (!categories) return res.status(404).json({ msg: 'Kategori tidak ditemukan!' });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

exports.getCategoriesByid = async (req, res) => {
  try {
    const category = await prisma.categories.findFirst({
      where: {
        id: req.params.id
      }
    })
    if (!category) return res.status(404).json({ msg: 'Kategori tidak ditemukan!' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

exports.createCategories = async (req, res) => {
  const categoriesExist = await prisma.categories.findFirst({
    where: {
      name: req.body.name
    }
  })

  if (categoriesExist) {
    return res.status(400).json({ msg: 'Kategori sudah ada!' });
  }
  const {name, description} = req.body;
  if(!name || !description) {
    return res.status(400).json({ msg: 'Nama dan description wajib diisi!' });
  }
  try {
    const category = await prisma.categories.create({
      data: {
        ...req.body
      }
    })
    return res.status(200).json(category);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

exports.updateCategories = async (req, res) => {
  const category = await prisma.categories.findUnique({
    where: {
      id: req.params.id
    }
  })

  if(!category) {
    return res.status(404).json({ msg: 'Kategori tidak ditemukan!' });
  }
  try {
    const category = await prisma.categories.update({
      where: {
        id: req.params.id
      },
      data: {
        ...req.body
      }
    })
    res.status(200).json(category);
  }catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.deleteCategories = async (req, res) => {
  const category = await prisma.categories.findUnique({
    where: {
      id: req.params.id
    }
  })
  if(!category) {
    return res.status(404).json({ msg: 'Kategori tidak ditemukan!' });
  }
  try {
    const category = await prisma.categories.delete({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}