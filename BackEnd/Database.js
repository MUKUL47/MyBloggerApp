var loggedIn=false;
var currentId="";
var username="";
class db{

myBlog(){

	var mongo=require('mongoose');
	mongo.connect("mongodb://localhost/Blogger",{ useNewUrlParser: true });

var myblog=new mongo.Schema({
	username:String,
	email:String,
	password:String,
	Requests_Notifi : Boolean,
	Accept_Notifi :Boolean,
	post : [{

		title : String ,
		Date : String,
		picture : String ,
		Description : String,
		Status : String,  //public,private(friends),onlyMe
		Likes :String,
		Keywords : [],

		Liked_Unliked : [],



		Comments:[{

			Comment:String,
			userName:String,
			userId : String,
			children : []
		 }]

		}], // date
		Friends : [{
			User : String,
		 	Date : String,
		 	UserName : String,
		 	Email : String,
		}
		],
		 Requests : [{
		 	User : String,
		 	Date : Date,
		 	UserName : String,
		 	Email : String, // true accept, false reject(delete request later) default null(nor accept/reject)
		 }],

		 SentRequests : [{
		 	User : String,
		 	Date : String,
		 	UserName : String,
		 	Email : String,
		 }] ,

		 sentMessage :[{
		 	User : String,
			Messages : String
		 }]

		 //when true <%=someone has sent u request%> // false (default)
		 //	Friends : Boolean,//when true <%=someone acccepted your request%> // false (default)

})
var blog=mongo.model("Blogger",myblog);

}
}

module.exports=new db();
