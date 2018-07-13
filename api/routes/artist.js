'use strict'

var express= require('express');
var ArtistController = require('../controllers/artist');

var api=express.Router();
var md_auth= require('../middlewares/authenticated');

api.get('/get-artist/:page',md_auth.ensureAuth,ArtistController.getArtists);
api.post('/save-artist',md_auth.ensureAuth,ArtistController.saveArtist)
api.post('/update-artist/:id',md_auth.ensureAuth,ArtistController.updateArtist)
api.delete('/delete-artist/:id',md_auth.ensureAuth,ArtistController.deleteArtist)

module.exports=api;
