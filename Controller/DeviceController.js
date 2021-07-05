var deviceController = {};

var responseHelper = require('./../Helpers/ResponseHelper');

deviceController.create = async (req, res) => {
	try {

		if (!req.user || req.user['role'] != ADMIN_ROLE) {
			return responseHelper.sendErrResponse(req, res, ["you arenot authourzie to this page."]);
		}

		let body = req.body;
		if (!body.name || !body.os) {
			return responseHelper.sendErrResponse(req, res, ["require fieled empty"]);
		}
		let validateSql = `SELECT id FROM devices WHERE name = ?;`;
		let validateRes = await queryExecute(validateSql, [body.name]);
		if (validateRes.length) {
			return responseHelper.sendErrResponse(req, res, ["already exists."]);
		}
		let insertSql = `INSERT INTO devices SET name  = ?, os = ?, extra = ?;`;
		await queryExecute(insertSql, [body.name, body.os, (body.os || null)])
		return responseHelper.sendSucessResponse(req, res, ["successfull"]);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}

}
deviceController.index = async (req, res) => {
	try {
		let selectSql = `
			SELECT d.id, d.name, d.os, d.extra,
			 	IF(d.status = '2', 'acquired', 'not acquired'),
			 	u.name as acquired_by
			FROM devices d
			LEFT JOIN users u on u.id = d.acquired_by
 			ORDER BY 1 DESC `;
		let selectRes = await queryExecute(selectSql, [])
		return responseHelper.sendSucessResponse(req, res, ["successfull"], selectRes);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}
}
deviceController.update = async (req, res) => {
	try {

		if (!req.user || req.user['role'] != ADMIN_ROLE) {
			return responseHelper.sendErrResponse(req, res, ["you arenot authourzie to this page."]);
		}
		if (!req.params.device_id || !req.body.os) {
			return responseHelper.sendErrResponse(req, res, ["require fieled empty"]);
		}
		let validateSql = `SELECT id FROM devices WHERE id = ?;`;
		let validateRes = await queryExecute(validateSql, [req.params.device_id]);
		if (validateRes.length == 0) {
			return responseHelper.sendErrResponse(req, res, ["given device not exist."]);
		}

		let updateSql = `UPDATE devices SET os = ? WHERE id = ?;`
		await queryExecute(updateSql, [req.body.os, req.params.device_id])
		return responseHelper.sendSucessResponse(req, res, ["successfull"]);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}
}

deviceController.delete = async (req, res) => {
	try {
		if (!req.user || req.user['role'] != ADMIN_ROLE) {
			return responseHelper.sendErrResponse(req, res, ["you arenot authourzie to this page."]);
		}

		if (!req.params.device_id) {
			return responseHelper.sendErrResponse(req, res, ["require fieled empty"]);
		}
		let validateSql = `SELECT id FROM devices WHERE id = ?;`;
		let validateRes = await queryExecute(validateSql, [req.params.device_id]);
		if (validateRes.length == 0) {
			return responseHelper.sendErrResponse(req, res, ["given device not exist."]);
		}
		let deleteSql = `DELETE FROM devices  WHERE id = ?;`
		await queryExecute(deleteSql, [req.params.device_id])
		return responseHelper.sendSucessResponse(req, res, ["successfull"]);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}
}


deviceController.reserveRelease = async (req, res) => {
	try {

		if (!req.params.device_id) {
			return responseHelper.sendErrResponse(req, res, ["require fieled empty"]);
		}

		if (!req.body.action || ["reserve", "release"].indexOf(req.body.action) < 0) {
			return responseHelper.sendErrResponse(req, res, ["action type invalid."]);
		}
		let action = req.body.action;
		let validateSql = `SELECT id,status, acquired_by FROM devices WHERE id = ?;`;
		let validateRes = await queryExecute(validateSql, [req.params.device_id]);
		if (validateRes.length == 0) {
			return responseHelper.sendErrResponse(req, res, ["given device not exist."]);
		}

		let updateSql = `UPDATE devices SET status = ?, acquired_by = ? WHERE id = ?;`;
		let status;
		let acquired_by;
		if (action == "reserve") {
			if (validateRes[0]['acquired_by'] && req.user['id'] != validateRes[0]['acquired_by']) {
				return responseHelper.sendErrResponse(req, res, ["someone already reserved."]);
			}
			status = "2";
			acquired_by = req.user['id'];
		} else {
			if (!validateRes[0]['acquired_by']) {
				return responseHelper.sendErrResponse(req, res, [" already released."]);
			} else if (validateRes[0]['acquired_by'] != req.user['id']) {
				return responseHelper.sendErrResponse(req, res, ["invalid access."]);
			}
			status = "1";
			acquired_by = null;
		}
		await queryExecute(updateSql, [status, acquired_by, req.params.device_id])
		return responseHelper.sendSucessResponse(req, res, ["successfull"]);
	} catch (e) {
		console.error(e);
		return responseHelper.sendErrResponse(req, res, [e]);
	}
}



module.exports = deviceController;