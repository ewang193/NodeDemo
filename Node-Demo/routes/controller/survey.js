var express = require('express');
var router = express.Router();
var requestClient = require('request');
var faastAPIUrl = process.env.FAAST_API_URL;

router.get('/index', function(req,res){
  res.render('survey');
});

router.get('/surveyDesigner', function(req, res){
  res.render("surveyDesigner");
});

router.post('/surveyDesigner', function(req, res){
  var jwt = req.cookies['jwt-cerberus'];
  var surveyID = req.body.surveyID;
  var surveyList = [];
  var survey = {};

  requestClient.post({
    url: faastAPIUrl + 'surveyEngine/getSurveys',
    headers: {
      'jwt': jwt,
      'content-type': 'application/json'
    }
  }, function(err, response, body){
    if(err){
      alert("there is a error");
    } else {
      surveyList = JSON.parse(body).data;
      surveyList.forEach(function(item){
        if(item.uuid == surveyID){
          survey = item;
          res.render("surveyDesigner", {survey: JSON.stringify(survey)});
        }
      })
    }
  })
});

router.get('/survey-ans/:oGuid', function(req, res){
  var jwt = req.cookies['jwt-cerberus'];
  requestClient.get({
    url: faastAPIUrl + 'surveyEngine/getSurveyObj/' + req.params.oGuid,
    headers: {
      'jwt': jwt,
      'content-type': 'application/json'
    }
  },function(err, response, body){
    var obj = JSON.parse(body);
    if(obj && obj.code === 0){
      res.render("doSurvey", {survey:obj.data.suGuid, surveyObj: obj.data.oGuid});
    }
  })
});

router.get('/doSurvey/:suGuid', function(req, res){
  var jwt = req.cookies['jwt-cerberus'];
  requestClient.post({
    url: faastAPIUrl + 'surveyEngine/createSurveyObj',
    headers: {
      'jwt': jwt,
      'content-type': 'application/json'
    },
    body: JSON.stringify({suGuid: req.params.suGuid})
  }, function(err, response, body){
    var obj = JSON.parse(body);
    if(obj && obj.code == 0){
      res.redirect("/CERBERUS/survey/survey-ans/" + obj.data.oGuid);
    } else {
      res.send("error");
    }
  })
});

router.get('/getSurveyById', function(req, res){
  var jwt = req.cookies['jwt-cerberus'];
  requestClient.post({
    url: faastAPIUrl + 'surveyEngine/getSurveys',
    headers: {
      'jwt': jwt,
      'content-type': 'application/json'
    }
  }, function(err, response, body){
    if(err){
      return res.send({code: 100, message: "error in getting survey data"});
    }
    var returnData = JSON.parse(body);

    if(Array.isArray(returnData.data)){
      for(var key in returnData.data){
        if(returnData.data[key].uuid == res.req.query.uuid){
          return res.send(returnData.data[key]);
        }
      }
    }
    return res.send({code: 100, message: "survey is empty"});
  })
});

module.exports = router;
