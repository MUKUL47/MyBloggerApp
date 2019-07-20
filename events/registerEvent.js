
$("#name").keyup(()=>{
    var str = $("#name").val()
        if(str.length > 0 && (str.charCodeAt(0) >=48  && str.charCodeAt(0) <= 57) ){
            $("#invalidName").html("INVALID NAME");
            $("#invalidName").show();
            $("#register").attr("disabled", true);
        }else{
            $("#invalidName").html("");
            $("#register").attr("disabled", !true);
        }
});
$("#email").keyup(()=>{
    var str = $("#email").val()
    if(str.length > 0 && (str.charCodeAt(0) >=48  && str.charCodeAt(0) <= 57 || str.charAt(0) == '@' )){
        $("#invalidEmail").html("INVALID EMAIL");
        $("#invalidEmail").show();
    }else{
        $("#invalidEmail").html("");
    }
});
$("#password").keyup(()=>{
    var str = $("#password").val()
    if(!checkRestConditions(str)){
        $("#invalidPassword").html("INVALID PASSWORD  <br> Length >= 8 <br> One lower case <br> One upper case");
        $("#invalidPassword").show();
        $("#register").attr("disabled", !true);
    }else{
        $("#invalidPassword").html("");
        $("#register").attr("disabled", !true);
    }
});

$("#retypePassword").keyup(()=>{
    var str = $("#retypePassword").val()
    if(str != $("#password").val() ){
        $("#invalidRetypePassword").html("Passwords did not match");
        $("#invalidRetypePassword").show();
        $("#register").attr("disabled", !true);
    }else{
        $("#invalidRetypePassword").html("");
        $("#register").attr("disabled", !true);
    }
});

function checkRestConditions(password){
    var lower = false, upper = false
    if( password.length < 8 ) return false;
    for( var i = 0; i < password.length; i++ ){
        if( !lower && ( password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122 )  ){ lower = true }
        if( !upper && ( password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90 )  ){ upper = true }
        if( lower && upper )  return true;
    }
    return false;

}