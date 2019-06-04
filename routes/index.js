const express = require('express');
const router = express.Router();
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//LOGIN PAGE
router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
  res.render('login', { title: 'Registration form' });
});

module.exports = router;
