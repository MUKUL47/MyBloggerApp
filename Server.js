var exp  		  = require('express'),
 	node 		  = exp(),
	bp     		  = require('body-parser'),
	path   		  = require('path'),
	passport 	  = require('passport'),
	localStrategy = require('passport-local').Strategy,
    $			  = require('jquery'),
    mongo 		  = require('mongoose'),
	server = require('http').createServer(node),
	expressip = require('express-ip');

	node.use(expressip().getIpInfoMiddleware);
	node.use(bp.urlencoded({extended:true}));
	node.use(exp.static("public"));
	node.use(exp.static("views"));
	node.use(exp.static(path.join(__dirname, 'events')))
	node.use(exp.static(path.join(__dirname, 'styles')))
	node.use(exp.static(path.join(__dirname, 'gmail')))
	node.use(exp.static(path.join(__dirname, 'API')))
	node.use(exp.static(path.join(__dirname, 'BackEnd')))
	let db = require("./BackEnd/Database");
	db.myBlog();
	let blog  = mongo.model("Blogger");
	

var user                 = require("./Routes/User"),
	post                 = require("./Routes/Post"),
 	search               = require("./Routes/Search"),
 	social               = require("./Routes/Social"),
 	api                  = require("./Routes/API/Controller"),
	Comment_Keyword_Like = require("./Routes/Comment_Keyword_Like")


node.use(api);
node.use(user);
node.use(Comment_Keyword_Like);
node.use(social);
node.use(search);
node.use(post);

server.listen(3001,'localhost')
