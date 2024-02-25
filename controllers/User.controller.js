const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();


exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (!users) return res.status(404).json({ msg: 'User not found!' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

exports.getUserByid = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

exports.updateUser = async (req, res) => {
  const users = await prisma.user.findFirst({
    where: {
      id: req.params.id
    }
  })

  if (!users) {
    return res.status(404).json({ msg: 'User not found.' });
  }
  let fileName = '';
  if (req.files === null) {
    fileName = users.image
    }else{
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) {
      res.status(422).json({ msg: 'Invalid Images' });
    }

    if (fileSize > 2000000)
      res.status(422).json({ msg: 'Image must be less than 2mb' });

      const filePath = `./public/users/${users.image}`;
      fs.unlinkSync(filePath);

      file.mv(`./public/users/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    const url = `${req.protocol}://${req.get('host')}/users/${fileName}`;
    try {
      await prisma.user.update(
        {
          where: {
            id: req.params.id
          },
          data: {
            fullname: req.body.fullname,
            image_url: url,
            image: fileName,
            phone: req.body.phone,
            address: req.body.address
          }
        }
      );
      res.status(200).json({ msg: 'Users updated!' });
    }
    catch (error) {
      res.status(400).json({ msg: error.message });
    }
}

exports.deleteUser = async (req, res) => {
  const users = await prisma.user.findFirst({
    where: {
      id: req.params.id
    }
  })
  if (!users) {
    return res.status(404).json({ msg: 'User not found.' });
  }
  const filePath = `public/users/${users.image}`;

  fs.unlinkSync(filePath);
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ msg: 'User deleted!' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}