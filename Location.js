/**
 * Created by samwe on 22/08/2016.
 */

Math.randomInt = function(i) {
    "use strict";
    return Math.floor(Math.random() * i);
};

var outpost = {};

function createResource(type) {
    "use strict";
    return {
        resourceType: type,
        remaining: 0,
        set_initial : function(amount) {
            this.remaining = amount;
        },
        get_remaining : function() {
            return this.remaining;
        },
        top_up : function(weather) {

        },
        gather : function(survivor) {
            //Do things
        }
    };
}

outpost.Templates = (function() {
    "use strict";
    function outpost_constructer(name, cap, fuel, water, food, climate, danger){
        return {
            name: name,
            outpost_carrying_capacity : cap,
            outpost_fuel: fuel,
            outpost_water: water,
            outpost_food: food,
            outpost_climate: climate,
            outpost_danger: danger
        };
    }

    //Loc ---------- cap -- fuel -- water -- food -- climate -- danger -- difficulty
    //wasteland ---- high - med --- low ---- low --- hot ------ med ----- -3
    //mountains ---- low -- low --- low ---- high -- cool ----- high ---- -2
    //ravines ------ low -- med --- high --- low --- med ------ low ----- -4
    //abandoned ---- med -- high -- med ---- med --- hot ------ high ---- -3
    //oasis -------- med -  low --- high --- high -- med ------ low ----- -5
    //marsh -------- high - high -- med ---- med --- cool ----- med ----- -7

    var outpost_wasteland = outpost_constructer("Wasteland", 3, 2, 1, 20, 3, 2);
    var outpost_mountains = outpost_constructer("Mountains", 1, 1, 1, 40, 1, 3);
    var outpost_ravines = outpost_constructer("Ravines", 1, 2, 3, 20, 2, 1);
    var outpost_abandoned = outpost_constructer("Abandoned", 2, 3, 2, 30, 3, 3);
    var outpost_oasis = outpost_constructer("Oasis", 2, 1, 3, 40, 2, 1);
    var outpost_marsh = outpost_constructer("Marsh", 3, 3, 2, 30, 1, 2);
    var types = [outpost_wasteland, outpost_mountains, outpost_ravines, outpost_abandoned, outpost_oasis, outpost_marsh];

    return {
        get_new_outpost : function() {
            return types[Math.randomInt(types.length)];
        }
    };
}());

outpost.Characteristics = (function() {
    "use strict";
    var currentType;
    var carryingCapacity;
    var fuel = createResource("Fuel");
    var water = createResource("Water");
    var food = createResource("Food");

    function assign_type() {
        currentType = outpost.Templates.get_new_outpost();
        carryingCapacity = calculate_carrying_capacity();
        fuel.set_initial(calculate_fuel());
        water.set_initial(calculate_water());
        food.set_initial(calculate_food());
    }

    function calculate_carrying_capacity() {
        var survivors_left = world.Survivors.get_survivors().length;
        var mid = Math.floor(survivors_left / 2);
        mid = (mid === 0) ? 1 : mid;
        carryingCapacity = mid * Math.randomInt(currentType.outpost_carrying_capacity);
    }

    function calculate_fuel() {
        return Math.randomInt(20) * currentType.outpost_fuel * carryingCapacity;
    }

    function calculate_water() {
        return world.Survivors.get_survivors().length * currentType.outpost_water;
    }

    function calculate_food() {
        return world.Survivors.get_survivors().length * currentType.outpost_food;
    }

    return {
        get_type : function() {
            return currentType;
        },
        get_new_outpost : function() {
            assign_type();
        },
        get_water : function() {
            return water;
        },
        get_fuel : function() {
            return fuel;
        },
        get_food : function() {
            return food;
        },
        change_weather : function(weather) {
            food.top_up(weather.food_bonus);
            water.top_up(weather.water_bonus);
        }
    };
}());


