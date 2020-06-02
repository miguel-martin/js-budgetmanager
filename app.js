// Module declaration
var budgetController = (function(){

    var x = 23;

    var add = function(a){
        return x + a;
    }

    return {
        publicTest: function(b){
            return(add(b));
        }
    }

})();



var UIController = (function(){

    // Some code

})();



var controller = (function(budgetCtrl, UICtrl){

    // some code
    var z = budgetCtrl.publicTest(5);

    return {
        anotherPublic: function(){
            console.log(z);
        }
    }

})(budgetController, UIController);

// call controller.anotherPublic(5) from console and check it works!