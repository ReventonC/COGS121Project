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
                success: (recipes) => {
                    console.log(recipes);
                    for(const r of recipes){
                      this.recipeList.push(r);
                    }
                }
            });

        }

    });
});
