// BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value * 100 / totalIncome); 
        }
        else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

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
        percentage: -1
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

        deleteItem: function(type, id) {
            var ids, index;

            // find the item
            ids = data.allItems[type].map(function(current){
                return current.id; 
            });

            index = ids.indexOf(id);

            //delete the element
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type){
        /* 
            + or - before the number
            exactly 2 decimal points
            comma separating thousands
        */

        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2); // exactly 2 decimal numbers. this is now a string...
        numSplit = num.split(".");

        int = numSplit[0];
        

        if (int.length > 3) { // more than a thousand... add a comma
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); // input 25310, output 25,310
        }

        dec = numSplit[1];
        
        return (type === 'exp' ? '-' : '+') + ' ' + int + "." + dec;

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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } 
            else {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            console.log(type);
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            

            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {

            var fields;

            fields = document.querySelectorAll(DOMstrings.expensesPercLabel); // returns a NodeList
            console.log(fields);

            var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            }

            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0){ 
                    current.textContent = percentages[index] + '%';
                }
                else {
                    current.textContent = '---';
                }
            });

        },

        displayDate: function(){
            var now, year, month, months;
            now = new Date();
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            month = months[now.getMonth()];
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year;
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

        // use event delegation to set up the listener to the common parent for incomes and expenses
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);


    };

    var updateBudget = function(){
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        // Calculate the percentages
        budgetCtrl.calculatePercentages();

        // read the percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

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

            // 6. Calculate and update percentages
            updatePercentages();
        }
       

    };

    var ctrlDeleteItem = function(event) {

        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //  inc-1
            splitID = itemID.split('-'); // returns an array with [type, id]
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // console.log("Deleting item " + type + ID);

            // Delete the item for the data structure
            budgetCtrl.deleteItem(type, ID);

            // Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // update and show the new budget
            updateBudget();

            // Calculate and update percentages
            updatePercentages();

        }




    };

    return {
        init: function(){
            //console.log('Application has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            }); 

            UICtrl.displayDate();

            setupEventListeners();
        }
    };
    

})(budgetController, UIController);

controller.init();


