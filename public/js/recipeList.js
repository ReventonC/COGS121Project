/*
    Renders a vue instance of a recipe list. 
    Use ajax call in the "mounted" block to grab data from the backend api call,
    and render the data to the frontend.
*/

$(document).ready(() => {
    const username = Cookies.get('user');
    $(".content").on('click', '.recipeBox', function (){
       //go to the recipeResult page through here
       window.location = "recipeResult";
    });
 
    $("#accountBoxUserName").html(Cookies.get("user"));

    const resultListComponent = new Vue({
        el: "#resultList",
        data: {
            recipeList: []
        },
        methods: {
            isListEmpty: function (e) {
                return true? this.recipeList.length == 0 : false;
            },
            getId: function(id) {
              document.cookie = "id=" + id;
              //console.log(Cookies.get('id')); //works
            },
        },
        mounted: function() {
            // Make AJAX call to Grab the current user's ingredients and make API call and then display 
            // the list of recipes
            const username = Cookies.get('user');
            $.ajax({
                type: 'POST',
                data: {user: username, checked: Cookies.get('checked_ingredients')},
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
