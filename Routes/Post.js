var mongo=require('mongoose');
let blog = mongo.model("Blogger");
var exp=require('express')
var node=exp.Router();
let Auth = require("../BackEnd/Auth");
var $ = require('jquery'),
    globalException = ""
let checkLoggedIn = function(req,res,next){
	if(Auth.AuthLogged.loggedIn){
		next();
	}else{
		setGlobalException(req.url.split('/')[1])
		res.render("mainlogin.ejs",{message:globalException});
	}
}
let setGlobalException = (exception)=>{
    switch (exception) {
        case "newblog":
            globalException = "Login to create post"
            break
		case "delete":
            globalException = "Login to delete post"
            break

		case "onlyMe" :
		case "private":
		case "public" :
            globalException = "Login to change status"
            break
		case "like":
            globalException = "Login to like"
            break
    }
}
node.get("/newblog",checkLoggedIn,function(req,res,next) {
		res.render("newblog.ejs",{username:Auth.AuthUsername.username});

})

let frontPage = function(req,res){
	blog.findOne({_id:Auth.AuthId.Id},function(e,i){

			res.redirect("/");
			})

}

node.post("/newblog",checkLoggedIn,function(req,res,next) {
		console.log(req.ipInfo)
		let post1={
			title : req.body.title || "Unnamed Title" ,
			date : new Date,
			picture : req.body.image || "https://cdn.browshot.com/static/images/not-found.png",
			Description : req.body.content,
			Status : "onlyMe",
			Likes : "0",
			
		
		}
		blog.updateMany({_id:Auth.AuthId.Id},
		{ $push : { post : post1  }},function(e,i){
			next();		
		})
		},frontPage);

node.post("/editBlog/:postId",checkLoggedIn,function(req,res,next){
   		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		var postId1=req.params.postId;
		console.log(postId1)
		var title = req.body.title,
		    picture = req.body.image  || "https://cdn.browshot.com/static/images/not-found.png",
			Description = req.body.content;
			
	blog.updateOne({ "post._id" : req.params.postId },{ $set : {  "post.$.title" : title 
	,"post.$.picture":picture
	,"post.$.Description": Description }},function(e,i){
		next();
	});

},frontPage)

node.get("/delete/:postId",checkLoggedIn,function(req,res,next){
	postId=req.params.postId;

	blog.updateMany({ $pull :  { post  : { _id : postId }}},function(e,i){next();});
},frontPage);

node.get("/like/:postId",checkLoggedIn,function(req,res,next){
//need fixing
res.send({"message": "needFIXING"})
},frontPage)



node.get("/:status/:postId",checkLoggedIn,function(req,res,next){
	postId=req.params.postId;
	status=req.params.status;
	blog.update({ "post._id" : postId  } , { $set : { "post.$.Status" : status }},function(e,i){
		console.log(i);
	})
	next();
},frontPage);
module.exports=node;