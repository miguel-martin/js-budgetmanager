// BUDGET CONTROLLER
var budgetController = (function(){

    // some code

})();




// UI CONTROLLER
var UIController = (function(){

    return {
        getInput: function(){
            return {
                type: document.querySelector('.add__type').value, // will be either inc or exp
                desc: document.querySelector('.add__description').value, 
                value: document.querySelector('.add__value').value
            }
            
        }
    }

})();




// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var ctrlAddItem = function() {
        // 1. Get the filed input data
        var input = UICtrl.getInput();
        console.log(input);

        // 2. Add the item to the budget controller

        // 3. Add the new item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI

    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){

        if (event.keyCode === 13 || event.which == 13) { // older browsers use the which property, not the keyCode property
            ctrlAddItem();
        }
        

    });
    

})(budgetController, UIController);


