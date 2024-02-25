const {PrismaClient} = require('@prisma/client');

const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const prisma = new PrismaClient();

exports.register = async (req, res) => {
const { fullname,phone,address, email, password, confirmPassword } = req.body;

  if(!fullname) {
    return res.status(400).json({ msg: 'Please enter fullname' });
  }

  if(!phone) {
    return res.status(400).json({ msg: 'Please enter phone' });
  }

  if(!address) {
    return res.status(400).json({ msg: 'Please enter address' });
  }

  if(!password || !confirmPassword) {
    return res.status(400).json({ msg: 'Please enter password and confirm password' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Password did not match!' });
  }

  if(!email) {
    return res.status(400).json({ msg: 'Please enter email' });
  }

  const emailExist = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  if (emailExist) {
    return res.status(400).json({ msg: 'Email already used!' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: 'Password must be at least 6 characters!' });
  }

  const salt = await bcrypt.genSalt( 10 );
  const hash = await bcrypt.hash( password, salt );

  const fileName = 'default' + fullname + '.png';
  const filePath = `./public/default.png`;
  const output = `./public/users/${fileName}`;

   const img = fs.readFileSync(filePath);
   fs.writeFileSync(output, img);

   const url = `${req.protocol}://${req.get('host')}/users/${fileName}`;

  try {
    await prisma.user.create({
      data : {
        fullname: fullname,
        email: email,
        phone: phone,
        image_url: url,
        role: 'member',
        image: fileName,
        address: address,
        password: hash,
      }
    });
    
    return res.status(201).json({ msg: 'Registration success!' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

exports.login = async (req, res) => {
  try { 
    const { email, password } = req.body;

  if(!email) {
    return res.status(400).json({ msg: 'Please enter email' });
  }

  if(!password) {
    return res.status(400).json({ msg: 'Please enter password' });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  if (!user) {
    return res.status(400).json({ msg: 'User not found!' });
  }

  const checkPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!checkPassword) {
    return res.status(400).json({ msg: 'Wrong password!' });
  }

  const userId = user.id;
  const name = user.fullname;
  const useremail = user.email;
  const role = user.role;

  const accessToken = jwt.sign(
    {
      userId,
      name,
      useremail,
      role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15h'
    }
  )
  const refreshToken = jwt.sign(
    {
      userId,
      name,
      useremail,
      role
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d'
    }
  )
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      refresh_token: refreshToken
    }
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    accessToken
  })
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(204).json({ msg: 'No token!' });
  await prisma.user.update({
    where: {
      refresh_token: refreshToken
    },
    data: {
      refresh_token: null
    }
  });
  res.clearCookie('refreshToken');
  return res.status(200).json({ msg: 'Logout success!' });
}

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
}