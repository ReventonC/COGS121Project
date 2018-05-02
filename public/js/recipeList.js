$(document).ready(() => {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        success: (ingredients) => {
            const fridge_list = ingredients['fridge'];
            const spice_rack = ingredients['spices'];
            const cupboard = ingredients['cupboard'];

            $("#print_test_data").html(fridge_list + "      ");
            $("#print_test_data").append(spice_rack + "       ");
            $("#print_test_data").append(cupboard + "      ");
        }
    });
    
    $('.recipeBox').on('click', () => {
        window.location = "recipeResult";
    })
});