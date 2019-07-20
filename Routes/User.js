var mongo      = require('mongoose');
let blog       = mongo.model("Blogger");
var exp		   = require('express')
var node	   = exp.Router();
let Auth 	   = require("../BackEnd/Auth");
var $ 		   = require('jquery')
var gmailLogin = require('./gmail/index.js')
var sha512     = require('js-sha512');
var email      = "";

function startSession(username, _id, email){
    Auth.AuthLogged.loggedIn=true;
    Auth.AuthUsername.username=username;
    Auth.AuthId.Id=_id;
    Auth.AuthEmail.Email=email;
}

node.get("/",(req,res)=>{
	if(Auth.AuthLogged.loggedIn==true ){
		blog.findOne({_id:Auth.AuthId.Id},function(e,i){
					res.render("frontpage.ejs",{username:Auth.AuthUsername.username,id:Auth.AuthId.Id,post:i.post , 
				reqAccept : i.Accept_Notifi , sendReq : i.Requests_Notifi});
			})
	}else{
	res.render("frontpage.ejs",{username:Auth.AuthUsername.username,id:Auth.AuthId.Id});}
})

let loginIfEmailExists = (req,res,next)=>{
    email = gmailLogin.email;
    gmailLogin.email = "";
    if( email != undefined ){
        blog.findOne({ email : email },(e,i)=>{

            if( i != undefined ){
                startSession(i.username, i._id, i.email);
                res.render("frontpage.ejs",{username:Auth.AuthUsername.username,id:Auth.AuthId.Id,post:i.post ,
                    reqAccept : i.Accept_Notifi , sendReq : i.Requests_Notifi});

            }else if(email != "") {
            	if(gmailLogin.exception == "login") {
                    res.render("register.ejs",{email_exist:"This email is not registered",$ : $, apiName : email.split('@')[0], apiAddress:email});
				}else if(gmailLogin.exception == "register"){
                    res.render("register.ejs",{email_exist:"Enter remaining credentials",$ : $, apiName : email.split('@')[0], apiAddress:email});
				}

            }else{
            	next();
			} })
    }else{
        next();
    }

}

node.get("/login",loginIfEmailExists,(req,res)=>{
	console.log(require('ip').address())
	res.render("mainlogin.ejs",{message:"", $ : $});
})



node.get("/register",loginIfEmailExists,(req,res)=> {
	res.render("register.ejs",{email_exist:"",$ : $, apiName : "", apiAddress:""});
})

node.get("/logout",function(req,res) {

    exports.params = "";
    gmailLogin.email = "";
	Auth.AuthUsername.username="";
	Auth.AuthLogged.loggedIn=false;
	Auth.AuthId.Id="";

	res.render("frontpage.ejs",{username:Auth.AuthUsername.username});
})


let userExists=(req,res,next)=>{
	blog.find({email:req.body.email},function(e,i){

		if(i==""){
			next();
		}else{
			res.render("register.ejs",{email_exist:"This email already exist"});
		}
	})
}
let checkEmail = (req,res,next)=>{
	var Email=req.body.email;
	var nope=false;
	blog.find({ email : Email },function(e,i){

		try{
			if(i[0]._id!=undefined){
				next();
			}
		}catch(exception){
				res.render("mainlogin.ejs",{message:"Email not registered "});
		}
		
		
	})
}

node.post("/register",userExists,(req,res,next)=>{
	
			let user={
				username : req.body.name,
				email : req.body.email,
				password : sha512(req.body.pass),
				Requests_Notifi : false,
				Accept_Notifi :false,
			
			}
			
		
			blog.create(user)
				res.render("mainlogin.ejs",{message:"Registered login now"});
	
})
node.post("/login",checkEmail,(req,res)=>{
	blog.findOne({email:req.body.email,password:sha512(req.body.pass)},function(e,i){
		if(i==undefined){
			res.render("mainlogin.ejs",{message:"Incorrect Password"});
		}else{
			startSession(i.username, i._id, i.email);
            res.render("frontpage.ejs",{username:Auth.AuthUsername.username,id:Auth.AuthId.Id,post:i.post ,
                reqAccept : i.Accept_Notifi , sendReq : i.Requests_Notifi, $ : $});

		}
	})
})

node.get("/profile",(req,res)=>{

	blog.find({},function(e,i){
		res.render("Profile.ejs",{username:Auth.AuthUsername.username , email : Auth.AuthEmail.Email, password : i.password });
	})
	
})


node.get("/gmailLogin/:loginOrRegister",gmailLogin.login)

node.get("/getAccessToken",gmailLogin.getAccessToken)

module.exports= node;