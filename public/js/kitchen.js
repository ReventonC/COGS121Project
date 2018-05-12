$(document).ready(() => {

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

    //console.log($("#user").val());

    // Get all the ingredients from the Fridge
    const fridge_list = [];
    for (const item of $("#fridgeList")) {
        console.log(item)
        console.log(name);
        const value = $(item).val();
        if (value != '') {
            fridge_list.push(value);
        }
    }
    console.log("fridgeList: " + fridge_list);

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

    //AJAX calls to the datbase to get the ingredients
    $.ajax({
        type: {
            'GET': 'recipes.db'.run(
                //change to select
                'UPDATE ingredients SET fridge_list=$fridge, ' +
                'spice_rack=$spices, cupboard=$cupboard WHERE username=$user',
                    {
                        //const list: from recipesdb
                        $fridge: fridge_list,
                        $spices: spice_rack,
                        $cupboard: cupboard,
                        $user: username
                    }
                )
            },
    });
    //console.log(fridge_list);


    // When user clicks "Submit", send the username and
    // password to the server to check if it is in the DB
    $("#make_meal").click(() => {

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
});
