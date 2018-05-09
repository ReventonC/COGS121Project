$(document).ready(() => {

    // When user clicks "Submit", send the username and
    // password to the server to check if it is in the DB
    $("#make_meal").click(() => {

        // Get all the ingredients from the Fridge
        const fridge_list = [];
        for (const item of $(".fridge_list")) {
            const value = $(item).val();
            if (value != '') {
                fridge_list.push(value);
            }
        }

        // Get all the ingredients from the spice rack
        const spice_rack = [];
        for (const item of $(".spice_rack")) {
            const value = $(item).val();
            if (value != '') {
                spice_rack.push(value);
            }
        }

        // Get all the ingredients from the cupboard
        const cupboard = [];
        for (const item of $(".cupboard")) {
            const value = $(item).val();
            if (value != '') {
                cupboard.push(value);
            }
        }

        //console.log(fridge_list);
        // All ingredients
        const all_ingredients = [];

        const ingredients = { fridge: fridge_list, spices: spice_rack, cupboard: cupboard };

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: ingredients,
        });
    });

    $('#addIngredientBtn').on('click', (e) => {
        $("#addIngredientModal").attr("class", "modal is-visuallyHidden");
        setTimeout(function () {
            $("header,.content").addClass("is-blurred");
            $("#addIngredientModal").attr("class", "modal");
        }, 100);
    });
    // Close the modal
    $("#closeModal").on('click', () => {
        $("#addIngredientModal").attr("class", "modal is-hidden is-visuallyHidden");
        $("header,.content").removeClass("is-blurred");
    }); 
    // When the user clicks anywhere outside of the modal, close it
    $(window).on('click', (e) => {
        if (e.target == $('#addIngredientModal')[0]) {
            $("#addIngredientModal").attr("class", "modal is-hidden is-visuallyHidden");
            $("header,.content").removeClass("is-blurred");
            $(".modal-content").display = "none";
        }
    });

    const fridgeComponent = new Vue({
        el: "#fridgeList",
        data: {
            ingredients: [
                {
                    name: "Pork Belly",
                    category: "Meat",
                    note: "2 pounds"
                }
            ]
        }
    });
});
