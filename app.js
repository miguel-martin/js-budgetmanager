// BUDGET CONTROLLER
var budgetController = (function(){

    // some code

})();




// UI CONTROLLER
var UIController = (function(){

    // Some code

})();




// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    document.querySelector('.add__btn').addEventListener('click', function() {
        
        // 1. Get the filed input data

        // 2. Add the item to the budget controller

        // 3. Add the new item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI

    });


    document.addEventListener('keypress', function(event){
        console.log(event); // if you check the keyCode property you will see the key that was pressed!
    });
    

})(budgetController, UIController);


