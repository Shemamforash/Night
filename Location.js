/**
 * Created by samwe on 22/08/2016.
 */

var outpost = {};

function createResource(r_name) {
    var resource = helper.resource_creator(r_name);
    resource.gather = function(survivor) {
        var skill;
        if(this.resource_name === "Fuel") {
            skill = survivor.fuel_find_skill;
        } else if(this.resource_name === "Water"){
            skill = survivor.water_find_skill;
        } else {
            skill = survivor.food_find_skill;
        }
        var max_find = helper.randomInt(5) + 5;
        var found = max_find * skill / 50;
        if(found > this.remaining){
            found = this.remaining;
        }
        this.remaining -= found;

        var suffix = "The " + this.resource_name + " ";
        if(this.remaining < 50){
            suffix += "is abundant";
        } else if (this.remaining < 25) {
            suffix += "is dwindling";
        } else if (this.remaining < 10) {
            suffix += "is scarce";
        } else if (this.remaining < 5) {
            suffix += "is almost gone";
        } else if (this.remaining === 0) {
            suffix += "is gone";
        } else {
            suffix += "is copious";
        }
        return {
            amount: found,
            suffix: suffix
        };
    };
    return resource;
}

outpost.Templates = (function() {
    function outpost_constructor(name, cap, fuel, water, food, climate, danger){
        return {
            outpost_name: name,
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

    var outpost_wasteland = outpost_constructor("Wasteland", 7, 2, 1, 20, 3, 2);
    var outpost_mountains = outpost_constructor("Mountains", 4, 1, 1, 40, 1, 3);
    var outpost_ravines = outpost_constructor("Ravines", 3, 2, 3, 20, 2, 1);
    var outpost_abandoned = outpost_constructor("Abandoned", 4, 3, 2, 30, 3, 3);
    var outpost_oasis = outpost_constructor("Oasis", 5, 1, 3, 40, 2, 1);
    var outpost_marsh = outpost_constructor("Marsh", 6, 3, 2, 30, 1, 2);
    var outpost_types = [outpost_wasteland, outpost_mountains, outpost_ravines, outpost_abandoned, outpost_oasis, outpost_marsh];

    return {
        get_new_outpost : function() {
            return outpost_types[helper.randomInt(outpost_types.length)];
        },
        get_outpost_by_name : function(name) {
            for(var i = 0; i < outpost_types.length; ++i){
                if(outpost_types[i].outpost_name === name){
                    return outpost_types[i];
                }
            }
        }
    };
}());

outpost.Characteristics = (function() {
    "use strict";
    var current_outpost;
    var fuel = createResource("Fuel");
    var water = createResource("Water");
    var food = createResource("Food");

    function assign_type() {
        current_outpost = outpost.Templates.get_new_outpost();
        fuel.increase(calculate_fuel());
        water.increase(calculate_water());
        food.increase(calculate_food());
    }

    function calculate_fuel() {
        return helper.randomInt(20) * current_outpost.outpost_fuel * current_outpost.outpost_carrying_capacity;
    }

    function calculate_water() {
        return survivor.CharacterManager.get_alive().length * current_outpost.outpost_water;
    }

    function calculate_food() {
        return survivor.CharacterManager.get_alive().length * current_outpost.outpost_food;
    }

    return {
        get_current_outpost : function() {
            return current_outpost;
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
            food.increase(weather.food_bonus);
            water.increase(weather.water_bonus);
        }
    };
}());


