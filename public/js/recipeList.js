$(document).ready(() => {

    $('.recipeBox').on('click', () => {
        window.location = "recipeResult";
    })

    const resultListComponent = new Vue({
        el: "#resultList",
        data: {
            recipeList: []
        },
        mounted: function() {
            // Grab the current user's recipes
            const username = Cookies.get('user');
            $.ajax({
                type: 'POST',
                data: {user: username},
                dataType: 'json',
                success: (ingredients) => {
                    console.log(ingredients);
                }
            });


            this.recipeList= [
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
        }

    });
});
