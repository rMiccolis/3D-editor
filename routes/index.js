var express = require('express');
var router = express.Router();




/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(`\n\nConnection from IP: ${req.connection.remoteAddress}`);
  res.render('index');
});

module.exports = router;
