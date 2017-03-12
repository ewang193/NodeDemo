var codeMapping = require(cerberus.codeMapping);

/**
 * extend res.render for filtering
 * @param view
 * @param options
 * @param callback
 */
module.exports = function(res, view, options, callback){
  var hasErr = false;
  console.log("res.err:", res.err);
  for(var key in res.err){
    hasErr = true;
  }

  if(hasErr){
    res.redirect(process.env.FAAST_LOGIN_PAGE)
  } else {
    res.render(view, options, callback);
  }
}
