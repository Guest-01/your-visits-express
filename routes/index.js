const express = require('express');
const { User, Ip } = require('../models');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/', async (req, res) => {
  const [ip, created] = await Ip.findOrCreate({
    where: { ip: req.ip },
    defaults: { count: 1 }
  });

  if (created) {
    console.log(`new IP: ${req.ip}`);
  } else {
    ip.count += 1;
  }

  if (req.session.user) {
    ip.UserId = req.session.user.id
  }
  await ip.save();

  let userInfo = null;
  if (req.session.user) {
    const rawIps = await Ip.findAll({ where: { UserId: req.session.user.id } });
    const ips = rawIps.map(ip => ip.toJSON()); // simplify raw object to JSON
    userInfo = {
      username: req.session.user.username,
      ips: ips.map(ip => ip.ip),
      totalCount: ips.reduce((acc, curr) => acc + curr.count, 0)
    }
    console.log(userInfo);
  }

  res.render('index', { ip, userInfo });
});

router.get('/signup', (req, res) => {
  res.render('signup', { messages: req.flash('signupError') })
});

router.post('/signup', async (req, res) => {
  console.log(req.body);
  let user = await User.findOne({
    where: {
      username: req.body.username
    }
  });
  console.log(user);

  if (user) {
    req.flash('signupError', `username ${req.body.username} already exists!`)
    return res.redirect('/signup')
  };

  user = await User.create({
    username: req.body.username,
    password: await bcrypt.hash(req.body.password1, 1)
  });

  res.redirect('/');
});

router.get('/login', (req, res) => {
  res.render('login', { messages: req.flash('loginError') });
});

router.post('/login', async (req, res) => {
  let user = await User.findOne({
    where: {
      username: req.body.username
    }
  })

  if (user) {
    const checkPw = await bcrypt.compare(req.body.password, user.password);
    if (checkPw) {
      req.session.user = user;
      console.log('login success!')
      return res.redirect('/');
    } else {
      req.flash('loginError', 'Password Incorrect!');
      return res.redirect('/login');
    }
  }
  req.flash('loginError', 'No such user');
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;