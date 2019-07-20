var mongo=require('mongoose');
let blog = mongo.model("Blogger");
var exp=require('express')
var node=exp.Router();
let Auth = require("../BackEnd/Auth");
var $ = require('jquery')
// let username="";
// let Id=Auth.AuthId.Id;
// let loggedIn=Auth.AuthLogged.loggedIn;

let checkLoggedIn = function(req,res,next){
	if(Auth.AuthLogged.loggedIn){
		next();
	}else{
		res.render("mainlogin.ejs",{message:""});
	}
}

node.post("/addKeyword/:postId",checkLoggedIn,function(req,res){
	var postid = req.params.postId;
	let keyword=req.body.Keyword;
	blog.updateOne({"post._id" : postid , "post.Keywords" : { $ne : keyword } },{ $push : { "post.$.Keywords" : keyword } },function(e,i){
		res.redirect("/post/"+postid);
	} )
})

node.get("/removeKeywords/:postId",checkLoggedIn,function(req,res){
	var postid = req.params.postId;
	blog.findOne({_id : Auth.AuthId.Id , "post._id":postid},function(e,i){
	var postID=[];	

	i.post.forEach(function(ii){
		if(ii._id+""==postid){
			res.render("keyWords.ejs", { keywords : ii.Keywords , username : Auth.AuthUsername.username , postId : postid })
			}
	})})})


node.get("/deleteKeyword/:postId/:Keyword",checkLoggedIn,function(req,res){
	var postid = req.params.postId;
	let keyword=req.params.Keyword;
	console.log(postid+"  "+keyword)
	blog.updateOne({"post._id" : postid },{ $pull : { "post.$.Keywords" : keyword  }},function(e,i){
		res.redirect("/post/"+postid);
	} )
})

node.post("/addComment/:postId",checkLoggedIn,function(req,res){
	var postId = req.params.postId;
	let comment=req.body.comment;
	blog.updateOne({"post._id" : postId },{ $push : { "post.$.Comments" : { Comment : comment ,
	 userName : Auth.AuthUsername.username , userId : Auth.AuthId.Id  } }},function(e,i){
		res.redirect("/post/"+postId);
	} )
})

node.get("/deleteComment/:commentId/:postId",checkLoggedIn,function(req,res){
	var commentId = req.params.commentId;
	var postid = req.params.postId;
	blog.updateOne({"post._id" : postid },
		{ $pull : { "post.$.Comments" : { _id : commentId }  }}
	,function(e,i){
		res.redirect("/post/"+postid);
	} )
})


node.get("/likePost/:postId",checkLoggedIn,function(req,res){
		var postid = req.params.postId;
		var userId=Auth.AuthId.Id;
		var userFound=false;
		var noOfLikes=0;
blog.find({"post._id" : postid},{"post.$" : 1},function(e,i){

	(i[0].post[0].Liked_Unliked).forEach(function(ii){

		if(ii+""==userId){
			userFound=true;
		}
	})

	if(userFound){
		noOfLikes=parseInt(i[0].post[0].Likes)-1;		
	}else{
		noOfLikes=parseInt(i[0].post[0].Likes)+1;
	}
	var Likes=noOfLikes+"";

	blog.update({"post._id" : postid}, { $set : { "post.$.Likes" : Likes }},function(e,i){
		if(userFound){

			blog.update({"post._id" : postid  }
		,{ $pull : { "post.$.Liked_Unliked" : userId }}
		,function(e,i){
		res.redirect("/post/"+postid);
	} )

		}else{
			blog.update({"post._id" : postid  }
		,{ $addToSet : { "post.$.Liked_Unliked" : userId }}
		,function(e,i){
		res.redirect("/post/"+postid);
	} )
		}
	})


})})

node.get("/replyComment/:commentId/:postId/:userName",checkLoggedIn,function(req,res){
	var commentId = req.params.commentId;
	var postid = req.params.postId;
	var userName = req.params.userName;
	res.render("replyComment.ejs",{commentId : commentId , postId : postid , userName : userName , username : Auth.AuthUsername.username})
})

node.get("/goBackToComments/:postId",checkLoggedIn,function(req,res){
	var postid = req.params.postId;
	res.redirect("/post/"+postid);
})

node.post("/replyComment/:commentId/:postId",checkLoggedIn,function(req,res){
	var commentId = req.params.commentId;
	var postid = req.params.postId;
	var reply = req.body.reply;
	/*
	,
	"Replies.userName" : Auth.AuthUsername.username,  "Replies.userId" : Auth.AuthId.Id*/
	blog.updateOne({"post._id" : postId },{ $push : { "post.$.Comments" : { Comment : reply ,
	 userName : Auth.AuthUsername.username , userId : Auth.AuthId.Id  } }},function(e,i){
		
	} )

	// blog.updateOne({"post._id" : postid , "post.Comments._id" : commentId },{ $push : { "post.$.Comments.children" :  }},function(e,i){
	// 	res.redirect("/post/"+postid);
	// } )
	
})



module.exports= node;