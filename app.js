// BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentaje: -1
    };


    return {
        addItem: function(type, des, val){
            var newItem, ID;

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }
            

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            }
            else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem); // add exp or inc item to allItems

            // Return new item
            return newItem;
            
        },

        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0){
                data.percentaje = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentaje = -1;
            }
            

        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentaje: data.percentaje
            }
        },

        testing: function(){
            console.log(data);
        }

    }

})();




// UI CONTROLLER
var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                desc: document.querySelector(DOMstrings.inputDescription).value, 
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type){
            var html, newHtml, element;

            // Create html string with placeholder text
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } 
            else {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            

        },

        clearFields: function(){
            var fields, fieldsArray;
            // get the fields to clear...
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // make an array...
            fieldsArray = Array.prototype.slice.call(fields);

            // clear all the fields...
            fieldsArray.forEach(function(current, index, array){
                current.value = "";
            });

            // set the focus to the first element (the description!)
            fieldsArray[0].focus();
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    }

})();




// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
    
            if (event.keyCode === 13 || event.which == 13) { // older browsers use the which property, not the keyCode property
                ctrlAddItem();
            }
            
    
        });
    };

    var updateBudget = function(){
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        console.log(budget);
    };

    // add new item
    var ctrlAddItem = function() {

        var input, newItem;

        // 1. Get the filed input data
        input = UICtrl.getInput();
        //console.log(input);

        // user input validation
        //  input.desc must be a string of length > 0
        //  input.value must be a number > 0
        if (input.desc !== "" && !isNaN(input.value) && input.value > 0){ 
             // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.desc, input.value);

            // 3. Add the new item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
        }
       

    };

    return {
        init: function(){
            console.log('Application has started');
            setupEventListeners();
        }
    };
    

})(budgetController, UIController);

controller.init();


