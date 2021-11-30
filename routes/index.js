const express = require('express');
const { Ip } = require('../models');

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
    await ip.save();
  }
  req.session.dummy = 'this is session';
  const session = JSON.stringify(req.session);
  res.render('index', { ip, session });
});

router.get('/signup', (req, res) => {
  res.render('signup')
});

router.post('/signup', async (req, res) => {
  console.log(req.body);
  res.redirect('/');
})

module.exports = router;