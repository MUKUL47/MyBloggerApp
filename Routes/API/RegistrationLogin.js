var mongo       = require('mongoose');
let blog        = mongo.model("Blogger");
var exp         = require('express')
var node        = exp.Router();
var bp          = require('body-parser');
let Auth        = require("../../BackEnd/Auth");
var stringify   = require('node-stringify');
var sha512      = require('js-sha512');

module.exports.loginInStatus = (req,res,next)=>{
    if(Auth.AuthLogged.loggedIn){
        next();
    }else{
        res.status(401)
        res.send({
            "error" : "Login first"
        })
    }
}

module.exports.checkEmail = (req,res,next)=>{
    var Email  = req.body.email;
    blog.find({ email : Email },function(e,i){
        try{
            if(i[0]._id != undefined){
                next();
            }
        }catch(e){
            res.status(404)
            res.send({
                "error" : "Email not registered"
            });
        }
    })
}

module.exports.login = (req,res)=>{
    blog.findOne({email:req.body.email,password:sha512(req.body.pass)},function(e,i){
        if(!i){
            res.status(401)
            res.send({ "error" : "Incorrect password" });
        }else{

            Auth.AuthLogged.loggedIn   = true;
            Auth.AuthUsername.username = i.username;
            Auth.AuthId.Id             = i._id;
            Auth.AuthEmail.Email       = i.email;

            blog.findOne({_id:Auth.AuthId.Id},function(e,i){
                res.send({ "success" : "Logged In" });
            })

        }
    })
}

module.exports.logout = (req,res)=>{
    Auth.AuthLogged.loggedIn   = false;
    Auth.AuthUsername.username = "";
    Auth.AuthId.Id             = "";
    Auth.AuthEmail.Email       = "";
    res.send({
        "success" : "Logged Out"
    })
}

module.exports.register = (req,res,next)=>{
    let user = {
        username : req.body.name,
        email : req.body.email,
        password : sha512(req.body.pass),
        Requests_Notifi : false,
        Accept_Notifi :false,
    }
   res.status(201)
   blog.create(user)
   res.send({
       "Account" : {
        username : req.body.name,
        email : req.body.email,
        password : sha512(req.body.pass)
       }
   });
}

module.exports.userExists = (req,res,next)=>{
    blog.find({email:req.body.email},function(e,i){    
        if(i == ""){
            next();
        }else{
            res.status(403)
            res.send({
                "error" : "Email exist"
            });
        }
    })
}

