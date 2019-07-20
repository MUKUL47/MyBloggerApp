var mongo= require('mongoose');
let blog = mongo.model("Blogger");
var exp  = require('express')
var node = exp.Router();
let Auth = require("../BackEnd/Auth");
var $ = require('jquery')
let frontPage = function(req,res){
	blog.findOne({_id:Auth.AuthId.Id},function(e,i){
				if(Auth.AuthLogged.loggedIn){res.render("frontpage.ejs",{username:Auth.AuthUsername.username,id:Auth.AuthId.Id,post:i.post});}
				else{
					res.render("frontpage.ejs");
				}
			})

}
var checkStatus = (req,res,next)=>{
    if( !Auth.AuthLogged.loggedIn ){

        blog.findOne( { "post._id" : req.params.postId  } , {"post.$" : 1} , ( e,i )=>{
			console.log(i.post[0].Status)
            if( i.Status === "onlyMe" ){ res.render("mainlogin.ejs",{message:"This post is private login in to interact"}); }
        })
    }else{
        next();
    }
}
node.get("/post/:postId",(req,res,next)=>{
var postId      = req.params.postId;
var sameUser    = false;
var Like        = "Like";

//OPTIMISE REMOVE EXTRA BACKEND CALL//
blog.find({ "post._id" : postId  } , {"post.$" : 1} ,function(e,i){
    console.log()

    if(i[0].post[0].Status != "public" && !Auth.AuthLogged.loggedIn){
    	res.render("mainlogin.ejs",{message : "This post is private login in to interact"});
    }

    if(i[0]._id.toString() == Auth.AuthId.Id.toString()){ sameUser = true; }

    i[0].post[0].Liked_Unliked.forEach(function(ii){
		if(ii.toString() == Auth.AuthId.Id.toString()){
			Like = "Unlike";
		}
	})
	var keywords = i[0].post[0].Keywords;

blog.findOne( { "post._id" : postId  } , {"post.$" : 1} , function( e,i ){

      if(Auth.AuthLogged.loggedIn){
          exports.sameUser = sameUser
          res.render("readMore.ejs", {
              post: i.post[0],
              username: Auth.AuthUsername.username, i: Auth.AuthId.Id, postId: postId,
              sameUser: sameUser, keywords: i.post[0].Keywords, replySection: i.post[0].Replies,
              commentSection: i.post[0].Comments, ID: Auth.AuthId.Id, Like: Like, Likes: i.post[0].Likes,
			  keywords : keywords
          });
	  }else{
          exports.sameUser = sameUser
          res.render("readMore.ejs",{ post : i.post[0] ,
              username : Auth.AuthUsername.username , i : Auth.AuthId.Id  , postId : postId , sameUser : false ,
              keywords : i.post[0].Keywords , commentSection : i.post[0].Comments , ID:"" , Like : "Like" ,  Likes : i.post[0].Likes+"" })
	  }

})
})
})
node.post("/search",function(req,res){
	//users, post, keywords
		blog.find({ "username" : req.body.query }, (e,i)=>{
			if(!e){

				var users = []
				i.forEach((u)=>{
					users.push(u.username)
				})
				res.render("searchPosts.ejs",{username1 : Auth.AuthUsername.username , users : users});
			}
			
			// var searchQuery = req.body.query,
	    	//    	users     = [],
			// 	post      = [],
			// 	keywords  = []
			// i.forEach((ii)=>{
            //     if( ii.username == searchQuery ){
            //         users.push(ii);
			// 	}
			// })
			// blog.find({ "post.title" : searchQuery }, (ePost, iPost)=>{

			// 	iPost[0].post.forEach((ii)=>{
            //             post.push(ii);
            //     })
			// 	if( post == undefined ) post = []
            //     res.render("usersList.ejs",{username : Auth.AuthUsername.username , users : users, post : post, currentId : Auth.AuthId.Id });
			// })
		})


	}
,frontPage)

module.exports=node;