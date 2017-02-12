var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs');
});
router.get("/detail/:idx", function(req, res, next) {
   res.render('index.ejs');
});

router.get('/zigbang', function(req, res, next) {
    res.render('zigbang_amp.html');
});

router.get('/zigbang_json', function(req, res, next) {
    fs.readFile('./public/zigbang/items.json', 'utf8', function (err, data) {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});


module.exports = router;
