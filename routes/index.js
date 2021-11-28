const express = require('express');
const { Ip } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
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

  res.render('index', { ip });
});

module.exports = router;