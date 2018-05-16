$(document).ready(() => {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        success: (ingredients) => {
            console.log(ingredients);
            const list = ingredients['list'];
            $("#print_test_data").html(list);

            // const fridge_list = ingredients['fridge'];
            // const spice_rack = ingredients['spices'];
            // const cupboard = ingredients['cupboard'];
            //
            // $("#print_test_data").html(fridge_list + "      ");
            // $("#print_test_data").append(spice_rack + "       ");
            // $("#print_test_data").append(cupboard + "      ");
        }
    });

    $('.recipeBox').on('click', () => {
        window.location = "recipeResult";
    })

    const resultListComponent = new Vue({
        el: "#resultList",
        data: {
            recipeList: [
                {
                    "id": 556470,
                    "title": "Apple fritters",
                    "image": "https://spoonacular.com/recipeImages/556470-312x231.jpg",
                    "imageType": "jpg",
                    "usedIngredientCount": 3,
                    "missedIngredientCount": 0,
                    "likes": 243
                },
                {
                    "id": 47950,
                    "title": "Cinnamon Apple Crisp",
                    "image": "https://spoonacular.com/recipeImages/47950-312x231.jpg",
                    "imageType": "jpg",
                    "usedIngredientCount": 3,
                    "missedIngredientCount": 0,
                    "likes": 35
                },
                {
                    "id": 534573,
                    "title": "Brown Butter Apple Crumble",
                    "image": "https://spoonacular.com/recipeImages/534573-312x231.jpg",
                    "imageType": "jpg",
                    "usedIngredientCount": 3,
                    "missedIngredientCount": 0,
                    "likes": 7
                },
                {
                    "id": 47732,
                    "title": "Apple Tart",
                    "image": "https://spoonacular.com/recipeImages/47732-312x231.jpg",
                    "imageType": "jpg",
                    "usedIngredientCount": 3,
                    "missedIngredientCount": 0,
                    "likes": 0
                },
                {
                    "id": 47891,
                    "title": "Apple Tart",
                    "image": "https://spoonacular.com/recipeImages/47891-312x231.jpg",
                    "imageType": "jpg",
                    "usedIngredientCount": 3,
                    "missedIngredientCount": 0,
                    "likes": 0
                },
                {
                    "id": 556470,
                    "title": "Apple fritters",
                    "image": "https://spoonacular.com/recipeImages/556470-312x231.jpg",
                    "imageType": "jpg",
                    "usedIngredientCount": 3,
                    "missedIngredientCount": 0,
                    "likes": 243
                },
                {
                    "id": 47950,
                    "title": "Cinnamon Apple Crisp",
                    "image": "https://spoonacular.com/recipeImages/47950-312x231.jpg",
                    "imageType": "jpg",
                    "usedIngredientCount": 3,
                    "missedIngredientCount": 0,
                    "likes": 35
                },
                {
                    "id": 534573,
                    "title": "Brown Butter Apple Crumble",
                    "image": "https://spoonacular.com/recipeImages/534573-312x231.jpg",
                    "imageType": "jpg",
                    "usedIngredientCount": 3,
                    "missedIngredientCount": 0,
                    "likes": 7
                },
                {
                    "id": 47732,
                    "title": "Apple Tart",
                    "image": "https://spoonacular.com/recipeImages/47732-312x231.jpg",
                    "imageType": "jpg",
                    "usedIngredientCount": 3,
                    "missedIngredientCount": 0,
                    "likes": 0
                },
                {
                    "id": 47891,
                    "title": "Apple Tart",
                    "image": "https://spoonacular.com/recipeImages/47891-312x231.jpg",
                    "imageType": "jpg",
                    "usedIngredientCount": 3,
                    "missedIngredientCount": 0,
                    "likes": 0
                },
            ]
        },
        mounted: {
            // ajax call
        }

    });
});
