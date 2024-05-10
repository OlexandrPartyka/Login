var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('auth', { title: 'Auth' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res) {
  res.send("login")
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Register' });
});

router.post('/register', function(req, res) {
  res.send('register');
});

module.exports = router;
