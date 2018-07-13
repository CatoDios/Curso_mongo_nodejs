'use strict'
var bcrypt=require('bcrypt-nodejs');
var User=require('../models/user');
var jwt=require('../services/jwt');
var fs=require('fs');
var path=require('path');


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
function loginUser(req,res){
    var params=req.body;
    var email=params.email;
    var password=params.password;

    User.findOne({email:email.toLowerCase()},(err,user)=>{
        if(err){
            res.status(500).send({message:"Error en la peticion"});
            
        }else{
            if(!user){
                res.status(404).send({message:"El usuario no existe"});
            }
            else{
                bcrypt.compare(password,user.password,function(err,check){
                    
                        if(check){
                            if(params.getHash){
                                //devolver un token jwt
                                res.status(200).send({
                                    token:jwt.createToken(user)
                                });
                            }
                            else{
                                res.status(200).send({user});
                            }
                        }else{
                            res.status(400).send({message:"El usuario no ha podido logearse"});

                        }
                    
                });
            }
        }
    })

}
function updateUser(req,res){
    var userId= req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId,update,(err,userUpdated)=>{
        if(err){
            res.status(500).send({message:'Error al actualizar el usuario'});
        }else{
            if(!userUpdated){
                res.status(404).send({message:'No se ha podido encontrar al usuario'});
            }else{
                res.status(200).send({user:userUpdated});
            }
        }
    });
}

function uploadImage(req,res){
    /* console.log(req.body);
    if(req.files){
        var file_name=req.files.image.path;
        console.log(file_name);
    }else{
        console.log("moises cabro");

    } */
    //res.status(200).send(req);
    var userId=req.params.id;
    var file_name='No subido...';
    if(req.files){
        var file_path=req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\/');
        var file_name=file_split[2];
        console.log(file_split);
        var ext_split= file_name.split('\.');
        console.log(ext_split);

        var file_ext=ext_split[1];
        console.log(ext_split);
        
        if(file_ext=='png' || file_ext=='jpg' || file_ext=='gif'|| file_ext=='jpeg'){ 
            User.findByIdAndUpdate(userId,{image:file_name},(err,userUpdated)=>{
                if(!userUpdated){
                    res.status(404).send({message:'No se ha podido actualiza rle ususario'})
                }else{
                    res.status(200).send({user:userUpdated});
                }
            });
        }else{
            res.status(200).send({user:userUpdated});
        }
    }else{
        res.status(200).send({message:'No has subido ninguna imagen'});
    }  
}

function getImageFile(req,res){
    var imageFile=req.params.imageFile;
    var path_file='./uploads/users/'+imageFile;
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen'});
        }
    })
}

module.exports= {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};