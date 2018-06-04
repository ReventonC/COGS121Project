/*
    Renders a vue instance of the kitchen, visualize all the ingredients a user has. 
    Use ajax call in the "mounted" block to grab data from the backend api call,
    and render the data to the frontend.
*/

$(document).ready(() => {

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

    $("#accountBoxUserName").html(Cookies.get("user"));



    const pantryComponent = new Vue({
        el: "#app",
        data: {
            newName: '',
            newCategory: '',
            newNote: '',
            ingredients: [],
            fridgeCategories: ["Meat", "Vegetable", "Dairy", "Fruit", "Drinks"],
            spiceRackCategories: ["Spice", "Oil", "Sauce"],
            cupboardCategories: ["Grain", "Misc"],
            selectedIngredientName: '',
            selectedIngredientCategory: '',
            selectedIngredientNote: '',
            selectedIngredientTarget: null,
            edit: false,
            checkedIngredients: []
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
                    
                    // Edit the currently selected ingredient
                    this.edit = false;
                    const oldIngredient = { name: this.selectedIngredientName, category: this.selectedIngredientCategory, note: this.selectedIngredientNote };
                    console.log("Editing from " + JSON.stringify(oldIngredient));

                    $(this.selectedIngredientTarget).closest("li").find(".ingredientName").text(newName);
                    $(this.selectedIngredientTarget).closest("li").find(".ingredientCategory").text(newCategory);
                    $(this.selectedIngredientTarget).closest("li").find(".ingredientNote").text(newNote);

                    for (i = 0; i < this.ingredients.length; i++) {
                        if (this.selectedIngredientName === this.ingredients[i].name && this.selectedIngredientCategory === this.ingredients[i].category && this.selectedIngredientNote === this.ingredients[i].note) {
                            this.ingredients[i].name = newName;
                            this.ingredients[i].category = newCategory;
                            this.ingredients[i].note = newNote;
                        }
                    }
                    this.selectedIngredientName = newName;
                    this.selectedIngredientCategory = newCategory;
                    this.selectedIngredientNote = newNote;

                    const editedIngredient = { name: newName, category: newCategory, note: newNote };
                    console.log("Editing to " + JSON.stringify(editedIngredient));
                    const username = Cookies.get('user');
                    editedIngredient.user = username;
                    editedIngredient.type = 3;
                    editedIngredient.oldName = oldIngredient.name;
                    editedIngredient.oldCategory = oldIngredient.category;
                    editedIngredient.oldNote = oldIngredient.note;

                    // AJAX call to change the new edited ingredient in the DB
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        data: editedIngredient
                    });
                    closeModal();
                } else {
                    
                    // ADD A NEW INGREDIENT TO THE USER'S DB
                    console.log("Adding " + JSON.stringify({ name: newName, category: newCategory, note: newNote }));
                    this.ingredients.push({ name: newName, category: newCategory, note: newNote });
                    //console.log(newName); //add this to the dataBase
                    //console.log(typeof(newName)); //is a string

                    const newestIngredients = { name: newName, category: newCategory, note: newNote };
                    const username = Cookies.get('user');
                    console.log(newCategory);
                    newestIngredients.user = username;
                    if (newCategory == "") {
                        alert("Please select a Category");
                        console.log(newName);
                        $('#ingredientNameInput').value = newName;
                        $('#ingredientNoteTextarea').value = newNote;
                    }
                    else {
                        newestIngredients.user = username;
                        newestIngredients.type = 1;
                        console.log(this.ingredients);
                        console.log(newestIngredients);
                        
                        // AJAX call to add new ingredient to DB
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            data: newestIngredients
                        });
                        this.newName = "";
                        this.newCategory = "";
                        this.newNote = "";
                        closeModal();
                    }

                }

            },
            removeIngredient: function (e, ingredient) {
                
                // Make AJAX call to remove an ingredient from the DB
                console.log("Ingredients before" + JSON.stringify(this.ingredients));
                for (i = 0; i < this.ingredients.length; i++) {
                    if (ingredient.name === this.ingredients[i].name) {
                        console.log("Removing " + JSON.stringify(ingredient));
                        this.ingredients.splice(i, 1);
                        ingredient.user = Cookies.get('user');;
                        ingredient.type = 2;
                        $.ajax({
                          type: 'POST',
                          dataType: 'json',
                          data: ingredient
                        });
                    }
                }
                console.log("Ingredients after" + JSON.stringify(this.ingredients));
                e.stopPropagation();
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
            closeModal: function (e) {
                closeModal();
            },
            selectCheckBox: function (e) {
                this.selectedIngredientTarget = e.target;
                this.selectedIngredientName = $(e.target).closest('li').find(".ingredientName").text();
                this.selectedIngredientCategory = $(e.target).closest('li').find(".ingredientCategory").text();
                this.selectedIngredientNote = $(e.target).closest('li').find(".ingredientNote").text();

                e.stopPropagation();
            },
            makeMeal: function (e) {
                this.checkedIngredients = this.ingredients.filter(ingredient => {
                    return ingredient.isChecked == true;
                }).map(ingredient => ingredient.name);

                if (this.checkedIngredients.length != 0) {
                    Cookies.set('checked_ingredients', this.checkedIngredients);
                    window.location = 'recipeList';
                } else {
                    alert("Please select the ingredients you want to use!");
                }
            }
        },
        mounted: function () {
            /* ajax call to load all the ingredients from database and render them on frontend */
            const user = { user: Cookies.get('user'), type: 0 };
            $.ajax({
                type: 'POST',
                data: user,
                dataType: 'json',
                success: (data) => {
                    for (const ingredient of data) {
                        this.ingredients.push(ingredient);
                    }

                }
            });
        }
    });

});
