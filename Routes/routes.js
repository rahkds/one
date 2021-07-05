var express = require('express');
var router = express.Router();
var deviceController = require('./../Controller/DeviceController');
var userController = require('./../Controller/UserController');


router.post('/user/signup', userController.signup);
router.post('/user/login', userController.login);
router.post('/user/logout', userController.logout);


router.post('/device', deviceController.create)
router.get('/device', deviceController.index)
router.put('/device/:device_id', deviceController.update)
router.delete('/device/:device_id', deviceController.delete)

router.put('/device/:device_id/reserverealse', deviceController.reserveRelease)

module.exports = router;