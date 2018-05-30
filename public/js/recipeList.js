$(document).ready(() => {

    $(".content").on('click', '.recipeBox', function (){      
       const username = Cookies.get('user');      
       $.ajax({
              type: 'POST',
              data: {user: username},
              dataType: 'json',
              success: (recipes) => {
              console.log(recipes);                  
                document.cookie = "id=" + recipes.id;
                console.log(document.cookie);
                
              }
      });
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
            }
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
