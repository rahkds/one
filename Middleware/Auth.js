var Auth = {};
var responseHelper = require('./../Helpers/ResponseHelper');
var URL = require('url');


Auth.checkAuth = async function(req, res, next) {

	let urlInfo = URL.parse(req.originalUrl);
	if (SKIP_AUTH_URL[urlInfo['pathname']]) {
		return next();
	}

	if (!req.headers['token']) {
		return responseHelper.sendErrResponse(req, res, ["invalid access"]);
	}

	redisClient.get('session.' + req.headers['token'], function(err, data) {
		if (err || !data) {
			return responseHelper.sendErrResponse(req, res, ["invalid access"]);
		}
		let userObj;
		try {
			userObj = JSON.parse(data);
		} catch (e) {
			return responseHelper.sendErrResponse(req, res, ["invalid access"]);
		}
		req.user = userObj;
		next();
	});
}

module.exports = Auth;