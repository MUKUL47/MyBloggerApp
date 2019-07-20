var mongo         = require('mongoose');
let blog          = mongo.model("Blogger");
var exp           = require('express')
var node          = exp.Router();
var bp            = require('body-parser');
let Auth          = require("../../BackEnd/Auth");
var stringify     = require('node-stringify');
var sha512        = require('js-sha512');
node.use(bp.urlencoded({extended:true}));
var registration  = require("./RegistrationLogin")
var validation    = require("./Validation")
var post          = require("./Post")
node.get("/myApi/showAll",(req,res)=>{ blog.find({},(e,i)=>{ setTimeout(
()=>{res.send(i)},5000
) }) })

//Registration ( register, login, logout )
node.post("/myApi/register",       registration.userExists,   registration.register)
node.post("/myApi/login",          registration.checkEmail,   registration.login)
node.get ("/myApi/logout",         registration.logout)


//fetchPost (create, getAll, getById, deleteById, getByKeywords)
node.post   ("/myApi/post/create",         registration.loginInStatus,  post.create)
node.get    ("/myApi/post",                registration.loginInStatus,  post.getAllPost);
node.get    ("/myApi/post/getById/:id",    registration.loginInStatus,  post.checkId, post.getPostById)
node.delete ("/myApi/post/deleteById/:id", registration.loginInStatus,  post.checkId, post.deleteById);
node.post   ("/myApi/post/getByKeywords",  registration.loginInStatus);

//InPost (addKeywords, updatePost, like/ dislike, setAccessDependency, comment, deleteComment)

//Friends (search, sendRequest, acceptRequest/ reject, deleteFriend)

//Profile (getProfile(both friend/ anonymous), editProfile)


module.exports=node;