/**
 * Created by samwe on 22/08/2016.
 */
var location = (function() {
    var types = [location_wasteland, location_mountains, location_ravines, location_abandoned, location_oasis, location_marsh];
    var currentType;
    var carryingCapacity;
    var fuel = createResource("Fuel");
    var water = createResource("Water");
    var food = createResource("Food");

    function assign_type() {
        currentType = types[Math.randomInt(types.length)];
        carryingCapacity = calculate_carrying_capacity();
        fuel.set_initial(calculate_fuel());
        water.set_initial(calculate_water());
        food.set_initial(calculate_food());
    };

    function calculate_carrying_capacity() {
        var survivors_left = world.get_survivors().length;
        var mid = Math.floor(survivors_left / 2);
        mid = (mid === 0) ? 1 : mid;
        var amnt = mid * Math.randomInt(currentType.location_carrying_capacity);
        carryingCapacity = amnt;
    }

    function calculate_fuel() {
        return Math.randomInt(20) * currentType.location_fuel * carryingCapacity;
    }

    function calculate_water() {
        return world.get_survivors().length * currentType.location_water;
    }

    function calculate_food() {
        return world.get_survivors().length * currentType.location_food;
    }

    return {
        get_type : function() {
            return currentType;
        },
        get_new_location : function() {
            assign_type();
        },
        get_water : function() {
            return water;
        },
        get_fuel : function() {
            return fuel;
        },
        get_food: function() {
            return food;
        }
    }
})();

Math.randomInt = function(i) {
    return Math.floor(Math.random() * i);
}

function location_constructer(cap, fuel, water, food, climate, danger){
    return {
        location_carrying_capacity : cap,
        location_fuel: fuel,
        location_water: water,
        location_food: food,
        location_climate: climate,
        location_danger: danger
    }
}

//Loc ---------- cap -- fuel -- water -- food -- climate -- danger -- difficulty
//wasteland ---- high - med --- low ---- low --- hot ------ med ----- -3
//mountains ---- low -- low --- low ---- high -- cool ----- high ---- -2
//ravines ------ low -- med --- high --- low --- med ------ low ----- -4
//abandoned ---- med -- high -- med ---- med --- hot ------ high ---- -3
//oasis -------- med -  low --- high --- high -- med ------ low ----- -5
//marsh -------- high - high -- med ---- med --- cool ----- med ----- -7

var location_wasteland = location_constructer(3, 2, 1, 1, 3, 2);
var location_mountains = location_constructer(1, 1, 1, 3, 1, 3);
var location_ravines = location_constructer(1, 2, 3, 1, 2, 1);
var location_abandoned = location_constructer(2, 3, 2, 2, 3, 3);
var location_oasis = location_constructer(2, 1, 3, 3, 2, 1);
var location_marsh = location_constructer(3, 3, 2, 2, 1, 2);

function createResource(type) {
    return {
        resourceType: type,
        remaining: 0,
        set_initial : function(amount) {
            this.remaining = amount;
        },
        get_remaining : function() {
            return this.remaining;
        },
        gather : function(survivor) {
            //Do things
        }
    };
};

