var mongo       = require('mongoose');
let blog        = mongo.model("Blogger");
var exp         = require('express')
var node        = exp.Router();
var bp          = require('body-parser');
let Auth        = require("../../BackEnd/Auth");
var stringify   = require('node-stringify');
var sha512      = require('js-sha512');

module.exports.getAllPost = (req,res)=>{
    blog.find({_id : Auth.AuthId.Id},(e,i)=>{
        if(e) res.send({ "error" : "Invalid Id" })
        else  res.send({ "Posts" : i[0].post })
    })
}

module.exports.checkId = (req,res,next)=>{
    blog.findOne({ "post._id" : req.params.id  } , {"post.$" : 1},(e,i)=>{
        res.status(404)       
        if(!i) res.send({ "error" : "Invalid Id" })
        else{ next() }
    })
}

module.exports.getPostById = (req,res)=>{
    blog.findOne({ "post._id" : req.params.id  } , {"post.$" : 1},(e,i)=>{
        res.status(200) 
        if(i != null) res.send(i.post[0])
    })} 

module.exports.deleteById = (req,res)=>{
    blog.updateMany({ $pull :  { post  : { _id : req.params.id }}},(e,i)=>{
            res.status(200) 
            res.send({ "Success" : "Deleted" })        
    });   
}

module.exports.create = (req,res)=>{
    res.setHeader("Content-Type", "application/json");
    res.send(req.body.title)
}