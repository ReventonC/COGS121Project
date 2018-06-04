/*
    Renders a vue instance of a recipe. 
    Uses ajax call in the "mounted" block to grab data from the backend api call,
    and render the data to the frontend.
    Also uses canvas js to make a data visualization of the amount of the ingredients
*/
$(document).ready(() => {
    $("#accountBoxUserName").html(Cookies.get("user"));

    const recipeComponent = new Vue({
        el: "#recipe",
        data: {
            vegetarian: '',
            vegan: '',
            glutenFree: '',
            dairyFree: '',
            veryHealthy: '',
            cheap: '',
            veryPopular: '',
            sustainable: '',
            weightWatcherSmartPoints: '',
            gaps: '',
            lowFodmap: '',
            ketogenic: '',
            whole30: '',
            preparationMinutes: '',
            cookingMinutes: '',
            sourceUrl: '',
            spoonacularSourceUrl: '',
            aggregateLikes: '',
            spoonacularScore: '',
            healthScore: '',
            creditText: '',
            sourceName: '',
            pricePerServing: '',
            extendedIngredients: [],
            id: '',
            title: '',
            readyInMinutes: '',
            servings: '',
            image: '',
            imageType: '',
            cuisines: '',
            dishTypes: '',
            diets: '',
            occasions: '',
            winePairing: '',
            instructions: '',
            analyzedInstructions: [],
            creditsText: '',
        },
        methods: {
            yesOrNo: function (val) {
                if (val) return "Yes";
                return "No";
            },

            clearID: function () {
                //clear cookie
                document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            },
        },
        mounted: function () {
            const username = Cookies.get('user');
            //console.log(username);
            const ingredientAmount = [];

            $.ajax({
                type: 'POST',
                data: { user: username },
                dataType: 'json',
                success: (instructions) => {
                    //console.log(instructions); //api information
                    //console.log(Object.keys(instructions));

                    //console.log(instructions.vegetarian);
                    //console.log(this.vegetarian); //prints the data field in vue
                    this.vegetarian = instructions.vegetarian;
                    //console.log(this.vegetarian); //works
                    this.vegan = instructions.vegan;
                    this.glutenFree = instructions.glutenFree;
                    this.dairyFree = instructions.dairyFree;
                    this.veryHealthy = instructions.veryHealthy;
                    this.cheap = instructions.cheap;
                    this.veryPopular = instructions.veryPopular;
                    this.sustainable = instructions.sustainable;
                    this.weightWatcherSmartPoints = instructions.weightWatcherSmartPoints;
                    this.gaps = instructions.gaps;
                    this.lowFodmap = instructions.lowFodmap;
                    this.ketogenic = instructions.ketogenic;
                    this.whole30 = instructions.whole30;
                    this.preparationMinutes = instructions.preparationMinutes;
                    this.cookingMinutes = instructions.cookingMinutes;
                    this.sourceUrl = instructions.sourceUrl;
                    this.spoonacularSourceUrl = instructions.spoonacularSourceUrl;
                    this.aggregateLikes = instructions.aggregateLikes;
                    this.spoonacularScore = instructions.spoonacularScore;
                    this.healthScore = instructions.healthScore;
                    this.creditText = instructions.creditText;
                    this.sourceName = instructions.sourceName;
                    this.pricePerServing = instructions.pricePerServing;
                    //console.log(instructions.extendedIngredients);  //just to see the format
                    //also works
                    // for(i of instructions.extendedIngredients){
                    //     //console.log(i);
                    //     this.extendedIngredients.push(i);
                    // }
                    this.extendedIngredients = instructions.extendedIngredients;
                    //console.log(this.extendedIngredients); //looks good
                    this.id = instructions.id;
                    this.title = instructions.title;
                    this.readyInMinutes = instructions.readyInMinutes;
                    this.servings = instructions.servings;
                    this.image = instructions.image;
                    this.imageType = instructions.imageType;
                    this.cuisines = instructions.cuisines;
                    this.dishTypes = instructions.dishTypes;
                    this.diets = instructions.diets;
                    this.occasions = instructions.occasions;
                    this.winePairing = instructions.winePairing;
                    this.instructions = instructions.instructions;
                    //console.log(instructions.analyzedInstructions[0].steps);
                    if (instructions.analyzedInstructions[0] == undefined) {
                        const recipeLink = instructions.spoonacularSourceUrl;
                        $("#instructions").html("<center><b>Instructions could not be loaded.</b></br>Please check out " + recipeLink.link(instructions.spoonacularSourceUrl) + " for more details</center>");
                        console.log("no instructions");
                    }
                    else {
                        for (i of instructions.analyzedInstructions[0].steps) {
                            //this.analyzedInstructions = instructions.analyzedInstructions;
                            //console.log(i)
                            this.analyzedInstructions.push(i);
                        }
                        //this.analyzedInstructions = instructions.analyzedInstructions;
                        //console.log(this.analyzedInstructions);
                    }


                    //chart rendering
                    this.creditText = instructions.creditText;

                    for (i = 0; i < instructions.extendedIngredients.length; i++) {
                        ingredientAmount.push({ y: instructions.extendedIngredients[i].measures.metric.amount, label: instructions.extendedIngredients[i].name });
                    }
                    chart.render();

                }
            });


            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                title: {
                    text: "Ingredients Percentage (g)",
                    horizontalAlign: "left"
                },
                data: [{
                    type: "doughnut",
                    startAngle: 60,
                    //innerRadius: 60,
                    indexLabelFontSize: 17,
                    indexLabel: "{label} - #percent%",
                    toolTipContent: "<b>{label}:</b> {y} (#percent%)",
                    dataPoints: ingredientAmount
                }]
            });
        }
    });
});