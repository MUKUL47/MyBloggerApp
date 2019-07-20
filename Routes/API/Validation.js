var mongo       = require('mongoose');
let blog        = mongo.model("Blogger");
var exp         = require('express')
var node        = exp.Router();
var bp          = require('body-parser');
let Auth        = require("../../BackEnd/Auth");
var stringify   = require('node-stringify');
var sha512      = require('js-sha512');

module.exports.validateRegistration = (req,res,next)=>{

}

module.exports.validateLogin = (req,res,next)=>{
    
}