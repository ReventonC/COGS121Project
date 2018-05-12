$(document).ready(() => {
  const username = Cookies.get('user');
  console.log(username);
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

    window.onload = () => {

        function openModal(e) {
            console.log("Open Modal");
            $("#addIngredientModal").attr("class", "modal is-visuallyHidden");
            setTimeout(function () {
                $("header,.wrapperPantry, #addIngredientBtn").addClass("is-blurred");
                $("#addIngredientModal").attr("class", "modal");
            }, 100);
        }

        function closeModal(e) {
            console.log("Close Modal");
            $("#addIngredientModal").attr("class", "modal is-hidden is-visuallyHidden");
            $("header,.wrapperPantry, #addIngredientBtn").removeClass("is-blurred");
            $(".modal-content").display = "none";
        }

        $(window).on('click', (e) => {
                    if (e.target == $('#addIngredientModal')[0]) {
                        if (this.edit) this.edit = false;
                        closeModal();
                    }
                });

        const pantryComponent = new Vue({
            el: "#app",
            data: {
                newName: '',
                newCategory: '',
                newNote: '',
                ingredients: [],
                fridgeCategories: ["Meat", "Vegetable", "Diary", "Fruit", "Drinks"],
                spiceRackCategories: ["Spice", "Oil", "Sauce"],
                cupboardCategories: ["Grain", "Misc"],
                selectedIngredientName: '',
                selectedIngredientCategory: '',
                selectedIngredientNote: '',
                selectedIngredientTarget: null,
                edit: false
            },
            computed: {
                fridgeItems() {
                    return this.ingredients.filter(ingredient => {
                        return this.fridgeCategories.includes(ingredient.category);
                    })
                },
                spiceRackItems() {
                    return this.ingredients.filter(ingredient => {
                        return this.spiceRackCategories.includes(ingredient.category);
                    })
                },
                cupboardItems() {
                    return this.ingredients.filter(ingredient => {
                        return this.cupboardCategories.includes(ingredient.category);
                    })
                }
            },
            methods: {
                addIngredient: function (newName, newCategory, newNote) {
                    if (this.edit) {
                        this.edit = false;
                        console.log("Editing from " + JSON.stringify({ name: this.selectedIngredientName, category: this.selectedIngredientCategory, note: this.selectedIngredientNote }));
                        $(this.selectedIngredientTarget).closest("li").find(".ingredientName").text(newName);
                        $(this.selectedIngredientTarget).closest("li").find(".ingredientCategory").text(newCategory);
                        $(this.selectedIngredientTarget).closest("li").find(".ingredientNote").text(newNote);
                        this.selectedIngredientName = newName;
                        this.selectedIngredientCategory = newCategory;
                        this.selectedIngredientNote = newNote;
                        console.log("Editing to " + JSON.stringify({ name: newName, category: newCategory, note: newNote }));
                    } else {
                        console.log("Adding " + JSON.stringify({ name: newName, category: newCategory, note: newNote }));
                        this.ingredients.push({ name: newName, category: newCategory, note: newNote });
                        //console.log(newName); //add this to the dataBase
                        //console.log(typeof(newName)); //is a string

                        //let username = localStorage.getItem("username");
                        console.log(username);
                        //Belongs in the fridge
                        if(this.fridgeCategories.includes(newCategory)){
                            console.log("we in da fridge");
                            let user = $.ajax({
                                type: {
                                    'GET': 'recipes.db'.run(
                                        'SELECT DISTINCT username FROM users',
                                        {
                                            $user: username,
                                        }
                                        /*(err) => {
                                            if (err) {
                                                console.log("There was an error finding the user");
                                            } else {
                                                console.log("User: "  username);
                                            }
                                        }*/

                                        /*'INSERT INTO ingredients VALUES ($username, $fridge)',
                                            {
                                                fridge_list: newName,
                                                $user: username,
                                            }
                                            (err) => {
                                                if (err) {
                                                    console.log("There was an error inserting ingredients")
                                                } else {
                                                    console.log("Successfully inserted " + newName + " into the fridge for " +  username);
                                                }
                                            }*/
                                        )
                                    },
                            });
                       }
                    }

                    this.newName = "";
                    this.newCategory = "";
                    this.newNote = "";
                    closeModal();
                },
                removeIngredient: function (ingredient) {
                    console.log("Ingredients before" + JSON.stringify(this.ingredients));

                    for (i = 0; i < this.ingredients.length; i++) {
                        if (ingredient.name === this.ingredients[i].name) {
                            console.log("Removing " + JSON.stringify(ingredient));
                            this.ingredients.splice(i, 1);
                        }
                    }
                    console.log("Ingredients after" + JSON.stringify(this.ingredients));

                },
                checkFridge: function () {
                    for (i = 0; i < this.ingredients.length; i++)
                        if (this.fridgeCategories.includes(this.ingredients[i].category))
                            return true;
                    return false;
                },
                checkSpiceRack: function () {
                    for (i = 0; i < this.ingredients.length; i++)
                        if (this.spiceRackCategories.includes(this.ingredients[i].category))
                            return true;
                    return false;
                },
                checkCupboard: function () {
                    for (i = 0; i < this.ingredients.length; i++)
                        if (this.cupboardCategories.includes(this.ingredients[i].category))
                            return true;
                    return false;
                },
                selectIngredient: function (e) {

                    this.selectedIngredientTarget = e.target;
                    this.selectedIngredientName = $(e.target).closest('li').find(".ingredientName").text();
                    this.selectedIngredientCategory = $(e.target).closest('li').find(".ingredientCategory").text();
                    this.selectedIngredientNote = $(e.target).closest('li').find(".ingredientNote").text();

                    console.log("Selecting " + JSON.stringify({ name: this.selectedIngredientName, category: this.selectedIngredientCategory, note: this.selectedIngredientNote }));
                    if ($(e.target).closest('li').hasClass("selected")) {
                        $(e.target).closest('li').removeClass("selected");
                        $(e.target).closest('li').addClass("ingredient");
                    } else {
                        $(e.target).closest('li').removeClass("ingredient");
                        $(e.target).closest('li').addClass("selected");
                    }
                },
                editIngredient: function (e) {
                    openModal();
                    this.edit = true;
                    this.selectedIngredientTarget = e.target;
                    this.selectedIngredientName = $(e.target).closest('li').find(".ingredientName").text();
                    this.selectedIngredientCategory = $(e.target).closest('li').find(".ingredientCategory").text();
                    this.selectedIngredientNote = $(e.target).closest('li').find(".ingredientNote").text();
                    console.log("Editing " + JSON.stringify({ name: this.selectedIngredientName, category: this.selectedIngredientCategory, note: this.selectedIngredientNote }));
                    this.newName = this.selectedIngredientName;
                    this.newCategory = this.selectedIngredientCategory;
                    this.newNote = this.selectedIngredientNote;
                    e.stopPropagation();
                },
                openAddModal: function (e) {
                    this.newName = "";
                    this.newCategory = "";
                    this.newNote = "";
                    openModal();
                },
                closeModal: function(e) {
                    closeModal();
                }
            },
            mounted: function () {

                this.ingredients = [
                    {
                        name: "Pork Belly",
                        category: "Meat",
                        note: "2 pounds"
                    }, {
                        name: "Lettuce",
                        category: "Vegetable",
                        note: "1 pack"
                    }, {
                        name: "Salt",
                        category: "Spice",
                        note: "Sea Salt"
                    }, {
                        name: "Rice",
                        category: "Grain",
                        note: "Never buy this brand again"
                    }, {
                        name: "Beef Sirloin",
                        category: "Meat",
                        note: "1 pound from Ralphs"
                    }, {
                        name: "Soy Sauce",
                        category: "Sauce",
                        note: "1 bottle"
                    }
                ];
            }
        });
    }

});
