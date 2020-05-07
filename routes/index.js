var express = require('express');
var router = express.Router();




/* GET home page. */
router.get('/', function (req, res, next) {
  var currentdate = new Date();
  var datetime = "Connected at: " + currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1) + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds() + "\n";
  console.log('\x1b[33m', `\n\nConnection from IP: ${req.connection.remoteAddress}`);
  console.log(datetime);
  res.render('index');
});

module.exports = router;
