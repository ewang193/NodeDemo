var express = require('express');
var router = express.Router();
var RAID_PGUID = process.env.RAID_PGUID;
var RAID_API_URL = process.env.RAID_API_URL;

router.get('/workflows', function(req, res){
  res.render('workflows');
});

router.get('/workflowProcess', function(req, res){
  res.render('workflowProcess');
});

router.get('/workflowDesigner', function(req, res){
  //get role list from server
  res.render('workflowDesigner', {
    roleList: [],
    RAID_PGUID: RAID_PGUID,
    RAID_API_URL: ARID_API_URL
  });
});

router.post('/workflowDesigner', function(req, res){
  res.render('workflowDesigner', {
    flowUID: req.body.flowUID,
    roleList: [],
    RAID_PGUID: RAID_PGUID,
    RAID_API_URL: RAID_API_URL
  });
});

module.exports = router;





