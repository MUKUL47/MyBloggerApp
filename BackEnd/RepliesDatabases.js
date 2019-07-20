	var mongo=require('mongoose');
	mongo.connect("mongodb://localhost/Blog_Replies",{ useNewUrlParser: true });
			Replies:[{

				Reply:String,
				userName:String,
				userId : String,
				Date : String
				commentId : String,
				postId : String
			}]