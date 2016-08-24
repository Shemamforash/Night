/**
 * Created by samwe on 24/08/2016.
 */
var helper = {};

helper.randomInt = function(i) {
    return Math.floor(Math.random() * i);
};

helper.create_function_wrapper = function(n, f){
    return {
        function_name: n,
        execute: f
    }
}

helper.resource_creator = function(name) {
    return {
        resource_name: name,
        remaining: 0,
        get_remaining : function() {
            return this.remaining;
        },
        increase : function(amnt) {
            this.remaining += amnt;
        },
        decrease : function(amnt) {
            this.remaining -= (amnt > this.remaining) ? this.remaining : amnt;
        }
    };
};