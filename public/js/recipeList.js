$(document).ready(() => {
    const username = Cookies.get('user'); 
       $.ajax({
          type: 'POST',
          data: {user: username},
          dataType: 'json',
          success: (recipes) => {
              //set up a different click handler for each recipe
              for(i in recipes){
                  $(".content").on('click', '.recipeBox', function (){ 
                       document.cookie = "id=" + recipes[i].id;
                    console.log(document.cookie);
                     window.location = "recipeResult";
                       
              });
              //go to the recipeResult page through here
             
          };

          //console.log(recipes[0].id);                  
          // document.cookie = "id=" + recipes.id;
          // console.log(document.cookie);
          
          }
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
