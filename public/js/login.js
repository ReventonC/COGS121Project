$(document).ready(() => {

    // When user clicks "Submit", send the username and
    // password to the server to check if it is in the DB
    $("#submit_btn").click(() => {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: { user: $("#user").val(), pass: $("#pass").val(), type: 0 },
            success: (login_res) => {
              if(login_res['loginRes'] == 0){
                Cookies.set('user', login_res['user']);
                window.location.href = "http://localhost:3000/kitchen";
              }else{
                $('#invalid_login').html("Incorrect username or password, please try again");
              }
            }


        });
    });

    $("#signup_btn").click(() => {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: { user: $("#user").val(), pass: $("#pass").val(), type: 1 }
        });
    });

});
