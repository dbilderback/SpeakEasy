var exports = module.exports = {}

exports.diary = function(req, res) {
  //res.render('diary');
  res.render('diary', { username: req.user.userId });
};

exports.root = function(req, res) {
  //res.render('diary');
  res.render('diary');
};

exports.main = function(req, res) {
  res.render('index');
};

exports.dashboard = function(req, res) {
	res.render('dashboard'); 
};

exports.entry = function(req, res) {
  res.render('entry');
};

exports.profile = function(req, res) {
  res.render('profile');
}

exports.logout = function(req,res){

  req.session.destroy(function(err) {
  res.redirect('/signin');
  });
};