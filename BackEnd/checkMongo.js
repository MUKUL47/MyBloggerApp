var mongo=require('mongoose');
let blog = mongo.model("Blogger");

class checkServer{
	connection(){
		console.log("connected back!!");
	}
}
module.exports=new checkServer();