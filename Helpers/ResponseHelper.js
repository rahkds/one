var responseHelper = {};

responseHelper.sendSucessResponse = function(req, res, message, data) {
	let responseObj = {
		code: 200,
		message: message || ["successfull"],
		data: data || [],
	};
	res.send(responseObj);
}

responseHelper.sendErrResponse = function(req, res, message, data) {
	let responseObj = {
		code: 400,
		message: message || ["error"],
		data: data || [],
	};
	res.status(500).send(responseObj);
}


module.exports = responseHelper;