/**
 * Created by samwe on 01/09/2016.
 */
var resources = {};

resources.WorldResources = (function() {
    var outpost_water;
    var outpost_fuel;
    var outpost_food;
    var world_water;
    var world_fuel;
    var world_food;


}());

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

        //Should be affected by how much they can carry (strength) and how much they can find (skill)
        var max_find = helper.randomInt(5) + 5;
        var found = max_find * skill / 50;
        if(found > this.remaining){
            found = this.remaining;
        }
        this.remaining -= found;

        var suffix = "The " + this.resource_name + " ";
        if(this.remaining === 0){
            suffix += "is gone";
        } else if (this.remaining < 5) {
            suffix += "is almost gone";
        } else if (this.remaining < 10) {
            suffix += "is scarce";
        } else if (this.remaining < 25) {
            suffix += "is dwindling";
        } else if (this.remaining < 50) {
            suffix += "is abundant";
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