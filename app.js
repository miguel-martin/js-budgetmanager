// Module declaration
var budgetController = (function(){

    var x = 23;

    var add = function(a){
        return x + a;
    }

    return {
        publicTest: function(){
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