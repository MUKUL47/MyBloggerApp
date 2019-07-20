//search people/their post[s](like/dislike) add/reject people
var mongo=require('mongoose');
let blog = mongo.model("Blogger");
var exp=require('express')
var node=exp.Router();
let Auth = require("../BackEnd/Auth");
var $ = require('jquery'),
	globalException = "";


let checkLoggedIn = (req,res,next)=>{
	if(Auth.AuthLogged.loggedIn){
		next();
	}else{

		console.log(globalException+" "+req.url)
		res.render("mainlogin.ejs",{message:globalException});
	}
}

let frontPage = function(req,res){
	blog.findOne({_id:Auth.AuthId.Id},function(e,i){
			res.redirect("/");
			})

}

node.get("/showFriends",checkLoggedIn,function(req,res,next) {
	var ffriends=[];
		blog.updateOne({ _id : Auth.AuthId.Id},{ $set :{ "Requests_Notifi" : false }},function(e,i){})
		blog.updateOne({ _id : Auth.AuthId.Id},
				{ $set :{ "Accept_Notifi" : false }}
				,function(e,i){
			
		})		
		blog.find({_id : Auth.AuthId.Id },function(e,i){
			var F=i[0].Friends;
			F.forEach(function(ii){

				ffriends.push(ii);
			})
			
			res.render("friendList.ejs",{username:Auth.AuthUsername.username, friends : ffriends})	
		})
		
})

node.get("/showUser/:userId/:userName",function(req,res,next) {
		var Posts=[];
		let isFriend=false;
		if( Auth.AuthLogged.loggedIn ){
            blog.find({_id : Auth.AuthId.Id},{ "Friends.User": req.params.userId  },function(e5,i5){
                isFriend = i5[0].Friends.length > 0;
                console.log(isFriend)
                blog.find({_id : req.params.userId},function(e,i){
                    var newPost = []
                    var Post = i[0].post;
                    Post.forEach((post)=>{
                        if( isFriend  && post.Status == "private" || post.Status == "public" ) newPost.push(post)
                        if( !isFriend && post.Status == "public") 		       				   newPost.push(post)
                    })
                    if( req.params.userName == "search" ){
                        exports.post = newPost;
                        res.send(newPost)
                    }else{
                        res.render("showUser.ejs",{username:Auth.AuthUsername.username, post : newPost, log : Auth.AuthLogged.loggedIn , Susername : req.params.userName,
                            recipientUserId : req.params.userId})
					}

                })
            })
		}else{
            blog.find({_id : req.params.userId},function(e,i){
                var newPost = []
                var Post = i[0].post;
                Post.forEach((post)=>{
                    if( post.Status == "public") newPost.push(post)
                })
                if( req.params.userName == "search" ){
                    exports.post = newPost;
                    res.send(newPost)
                }else{
                    res.render("showUser.ejs",{username:Auth.AuthUsername.username, post : newPost, log : Auth.AuthLogged.loggedIn , Susername : req.params.userName,
                        recipientUserId : req.params.userId})
				}

            })
		}



})

node.get("/showRequests",checkLoggedIn,function(req,res){
	//received and sent
	//received
	var received=[];

	var sent=[];
	blog.updateOne({ _id : Auth.AuthId.Id},
				{ $set :{ "Requests_Notifi" : false }}
				,function(e,i){
			
		})
	blog.find({_id : Auth.AuthId.Id},function(e,i){
	var sents=i[0].SentRequests;
	var request=i[0].Requests;
	sents.forEach(function(I){
		sent.push(I)
	})	
	request.forEach(function(I){
		received.push(I)
	})	
		
			
	res.render("userRequests.ejs",{username:Auth.AuthUsername.username , Rusers : request , Susers : sent})
			

			
		})})
	
	
node.get("/deleteFriend/:userId",checkLoggedIn,function(req,res,next) {
	
blog.updateOne({ _id : Auth.AuthId.Id  },{ $pull :{ Friends : { User : req.params.userId }}},function(e,i){})
		blog.updateOne({ _id : req.params.userId }, { $pull :{ Friends : { User : Auth.AuthId.Id  }}},function(e,i){
			res.redirect("/showFriends");	});
    blog.updateOne({ _id : Auth.AuthId.Id },   { $pull : { sentMessage : { User : req.params.userId } }}, (e,i)=>{});
    blog.updateOne({ _id : req.params.userId },{ $pull : { sentMessage : { User : Auth.AuthId.Id } }}, (e,i)=>{});
	
})	

node.get("/DeleteRequest/:userId",checkLoggedIn,function(req,res,next) {
	
	blog.updateMany( { $pull :{ SentRequests : { User :  req.params.userId }}},function(e,i){});
	blog.updateMany( { $pull :{ Requests : { User : Auth.AuthId.Id  }}},function(e,i){
	res.redirect("/showRequests");	
	})
	
})



node.get("/Reject/:userId",checkLoggedIn,function(req,res,next) {

		blog.updateOne({ _id : Auth.AuthId.Id  },{ $pull :{ Requests : { User : req.params.userId }}},function(e,i){})
		blog.updateOne({ _id : req.params.userId }, { $pull :{ SentRequests : { User : Auth.AuthId.Id  }}},function(e,i){
			res.redirect("/showRequests");	});
	})

node.get("/Accept/:userId/:userName/:email",checkLoggedIn,function(req,res,next) {

		var friendYou={
			"User" : req.params.userId,
			"UserName" : req.params.userName,
			"Email" : req.params.email
					}

	 	var friendMe={
			"User" : Auth.AuthId.Id,
			"UserName" : Auth.AuthUsername.username,
			"Email" : Auth.AuthEmail.Email
					}

		blog.updateOne({ _id : Auth.AuthId.Id , "Friends.User" : { $ne : req.params.userId  } },{ $push :{ Friends : friendYou }},(e,i)=>{})
		blog.updateOne({ _id : req.params.userId,"Friends.User" : { $ne : Auth.AuthId.Id  } },{ $push :{ Friends : friendMe }},(e,i)=>{})
		blog.updateOne({ _id : req.params.userId},{ $set :{ "Accept_Notifi" : true }},(e,i)=>{})
        blog.updateOne({ _id : Auth.AuthId.Id },   { $push : { sentMessage : { User : req.params.userId } }}, (e,i)=>{});
        blog.updateOne({ _id : req.params.userId },{ $push : { sentMessage : { User : Auth.AuthId.Id } }}, (e,i)=>{});
		res.redirect("/Reject/"+req.params.userId)
	})

node.get("/sendRequest/:userId/:userName/:emailId",checkLoggedIn,function(req,res,next) {
	var userId        = req.params.userId;
	var currentUserId = Auth.AuthId.Id;
	var userName      = req.params.userName;
	var emailId       = req.params.emailId;
	var currentEmail  = Auth.AuthEmail.Email;


	if(currentUserId!=userId){
	blog.update({_id : userId , "Requests.User" : { $ne : currentUserId }},
		{ $push : { Requests : { User : currentUserId , UserName : Auth.AuthUsername.username, Email : currentEmail } } },(e,i)=>{})

		blog.update({_id : currentUserId , "SentRequests.User" : { $ne : userId }},
		{ $push : { SentRequests : { User : userId , UserName : userName, Email : emailId} }} ,(ee,ii)=>{})
	 			blog.updateOne({ _id : req.params.userId},
				{ $set :{ "Requests_Notifi" : true }}
				,function(e,i){
			
		})
		res.redirect("/showRequests");
	 
	}else{
		res.redirect("/showRequests");
	}
	
})

node.get("/showMessages/:recipientUserId",checkLoggedIn,function(req,res) {


})

node.get("/:recipientUserId/send",checkLoggedIn,function(req,res) {
    blog.find({ _id : Auth.AuthId.Id } ,(e,i)=>{
        var messages = ""
        i.forEach(function(ii){
            (ii.sentMessage).forEach(function (iii) {
                if( iii.User == req.params.recipientUserId ){
                    messages = iii._id
                }
            })
        })
		blog.find({ "sendMessage._id" : messages }, { $set : { "sendMessage.Messages" : req.body.message } },(e,i)=>{})
	});
})



module.exports=node;