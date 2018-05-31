'use strict'

var express= require('express');
var UserController = require('../controllers/user');

var api=express.Router();

api.get('/controller-user',UserController.pruebas);

api.post('/registrer',UserController.saveUser);
module.exports=api;