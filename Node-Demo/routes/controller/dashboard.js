var express = require('express');
var router = express.Router();
var requestClient = require('request');
// var faastAPIUrl = process.env.FAAST_API_URL;
var RAID_PGUID = process.env.RAID_PGUID;
var RAID_API_URL = process.env.RAID_API_URL;

router.get('/', function (req, res) {
  res.render('dashboards');
});

module.exports = router;



router.get('/', function(req, res){
  res.render('barchartshows');
});

module.exports = router;
