'use strict'

var Artist=require('../models/artist');
var fs=require('fs');
var path=require('path');
var paginate=require('mongoose-pagination');

function getArtists(req,res){
    var page=req.params.page;
    var itemsPerPage=2;
    var name=req.params.name;
    Artist.find().sort('name').paginate(page,itemsPerPage,(err,artists,total)=>{
        if(err){
            res.status(500).send({message:'Error en la peticion'});

        }else{
            if(!artists){
                res.status(400).send({message:'No hay artistas D:'});
            }else{
                return res.status(200).send({
                    total:total,
                    artists:artists
                });
            }
        }
    });
}



function saveArtist(req,res){
    var artist=new Artist();
    var params=req.body;
    artist.name=params.name;
    artist.description=params.description;
    artist.image="null";
    artist.save((err,artistStored)=>{
        if(err){
            res.status(500).send({message:'Error en conexion'})
        }else{
            if(!artistStored){
                res.status(400).send({message:'No se pudo guardar'});
            }else{
                res.status(200).send({artist:artistStored});
            }
        }
    });
}
function updateArtist(req,res){
    var artistId=req.params.id;
    var update=req.body;

    Artist.findByIdAndUpdate(artistId,update,(err,artistUpdate)=>{
        if(err){
            res.status(500).send({message:"Error"})
        }else{
            if(!artistUpdate){
                res.status(404).send({message:"no encontrado"})
            }else{
                res.status(200).send({artist:artistUpdate})
            }
        }
    } );
}

function deleteArtist(req,res){
    var artistId=req.params.id;

    Artist.findByIdAndRemove(artistId,(err,artistRemoved)=>{
        if(err){
            res.status(500).send({message:"Error"})
        }else{
            if(!artistRemoved){
                res.status(400).send({message:"Artista no encontrado"})
            }else{
                res.status(200).send({artist:artistRemoved})
            }
        }
    })
}

module.exports={
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist
};