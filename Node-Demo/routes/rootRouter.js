var express = require('express');
var router = express.Router();

var workflow = require('./controller/workflow');
var responseRender=require(cerberus.responseRender);
// var restWorkflow = require('./rest/workflow');

// var survey = require('./controller/survey');
// var restSurvey = require('./rest/survey');
//
// var search = require('./controller/search');
//
var dashboard = require('./controller/dashboard');
//
// var vendorSetup = require('./controller/vendorSetup');
//
// var myAssignedWork = require('./controller/myAssignedWork');
var barChartShow = require('./controller/barChartShow');

var caseManagementPortal = require('./controller/caseManagementPortal');

var responseRender = require(cerberus.responseRender);



/**
 *index page for Raid
 */
router.get('/', function(req, res){
  responseRender(res, 'home');   //home.html
});

/**
 * workflow
 */
router.use('/workflow', workflow);
// router.use('/workflow', restWorkflow);

/**
 * survey
 */
// router.use('/survey', survey);
// router.use('/survey', restSurvey);
//
// /**
//  * search
//  */
// router.use('/search', search);
//
// /**
//  * dashboard
//  */
router.use('/dashboard', dashboard);
//
// /**
//  * dashboard
//  */
// router.use('/vendorSetup', vendorSetup);
//
// /**
//  * dashboard
//  */
// router.use('/myAssignedWork', myAssignedWork);

/**
 * bar chart show
 */
router.use('/barChartShow', barChartShow);

router.use('/caseManagementPortal', caseManagementPortal);

module.exports = router;





































