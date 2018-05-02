$(document).ready(() => {

    // When user clicks "Submit", send the username and
    // password to the server to check if it is in the DB
    $("#submit_btn").click(() => {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: { user: $("#user").val(), pass: $("#pass").val(), type: 0 }
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
