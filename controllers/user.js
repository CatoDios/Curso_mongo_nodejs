'use strict'
var bcrypt=require('bcrypt-nodejs');
var User=require('../models/user');

function pruebas(req,res){
    res.status(200).send({
        message:'Probando controlador user'
    });
}

function saveUser(req,res){
    var user=new User();
    var params = req.body;
    user.name=params.name;
    user.surname=params.surname;
    user.email=params.email;
    user.role="ROLE_USER";
    user.image="null";
    if(params.password){
        //encriptar y guardar
        bcrypt.hash(params.password,null,null,function(err,hash){
            user.password=hash;
            user.save((err,userStored)=>{
                if(err || !userStored){
                    res.status(500).send({message:'Error al guardar usuario'})
                }else{
                    res.status(200).send({user:userStored});
                }
            });
        });
    }else{
        res.status(500).send({message:'Introduce la contraseña'});
    }
}

module.exports= {
    pruebas,
    saveUser
};