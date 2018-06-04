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
                  
                // Set username Cookie, and go to the next page  
                Cookies.set('user', login_res['user']);
                window.location.href = window.location + "kitchen";
              }else{
                  
                // Inform user that username or password is incorrect
                alert("Incorrect username or password, please try again");
              }
            }


        });
    });

    // Make HTTP request upon hitting submit button to potentially add new user to DB if not already there
    $("#signup_btn").click(() => {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: { user: $("#user").val(), pass: $("#pass").val(), type: 1 }
        });
    });

});
