/**
 * New node file
 */

exports.plugin = function(app, environment, ppt, isPrivatePortal) {
  var myEnvironment = environment;
  
  /////////////////
  // Menu
  /////////////////
  myEnvironment.addApplicationToMenu("/webble","Webbles");
  /////////////////
  // Routes
  /////////////////
  app.get('/webble', function webbleGet(req, res) { 
    
    res.render('webble', myEnvironment.getCoreUIData(req));
  });
}