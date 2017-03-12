/**
 *get the abs path
 * @param path
 * @returns {*}
 */

global.abs_path = function(path){
  return base_dir + path;
}

global.include = function(file){
  return abs_path('/' + file);
}

/**
 *the path of filter
 *@type {{filter:string, responseFilter: string, requestFilter: string}}
 */
var ft = {
  filter: "filters/",
  responseFilter: "responseFilter/",
  requestFilter: "requestFilter/"
};

var ut = {
  util: "util/"
}

var rt = {
  routes: "routes/",
  controller: "controller/",
  rest: "rest/"
}

/***
 *service
 * @type {{}}
 */
var svs = {
  service: "service/"
}

/**
 * @type {{responseRender}}
 */
global.cerberus = {
  //filter dependency
  requestFilter: include(ft.filter+ft.requestFilter+"filters"),
  responseRender:include(ft.filter+ft.responseFilter+"responseRender"),
  jwtFilter:include(ft.filter+ft.requestFilter+'jwtFilter'),
  responseHandler:include(ft.filter+ft.responseFilter+"responseHandler"),
  codeMapping:include(ft.filter+ft.responseFilter+"codeMapping"),
  initFilter:include(ft.filter+ft.requestFilter+"initFilter"),

  //util part
  jwtUtil:include(ut.util+"jwt"),

  //routes
  rootRouter:include(rt.routes+"rootRouter"),
  workflowRest:include(rt.routes+rt.rest+"workflow"),

  //service
  workflowService:include(svs.service+"workflowService"),
  surveyService:include(svs.service+"surveyService")
}























