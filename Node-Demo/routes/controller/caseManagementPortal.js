var express = require('express');
var router = express.Router();
var RAID_PGUID = process.env.RAID_PGUID;
var RAID_API_URL = process.env.RAID_API_URL;

router.get('/', function(req, res){
    res.render('caseMgPortal');
});

module.exports = router;
