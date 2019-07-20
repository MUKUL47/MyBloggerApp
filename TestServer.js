var exp  = require('express')
var node = exp();
var bp   = require('body-parser');
node.use(bp.urlencoded({extended:true}));
node.use(exp.static("public"));
var $ = require('jquery')

node.get("/events",function(req,res,next) {
    //res.send("WORKING "+$)
    res.render("events.ejs",{$:$})
    //res.render("newblog.ejs",{username:Auth.AuthUsername.username});

})


node.listen(100,function(){
    console.log("running at port 100")
})
