

    $(".editPost").hide();

    $(".showPost").dblclick(()=> {
        $(".editPost").show();
        $(".showPost").hide();
    })
    $("#cancelImage").click(()=> {
        $(".editPost").hide();
        $(".showPost").show();
    })

