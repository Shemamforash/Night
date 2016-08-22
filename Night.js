/**
 * Created by samwe on 21/08/2016.
 */
var world = {};

world.General = (function() {
    var day = 0;
    var temperature = 30;
    var weathertypes = ["Rainy", "Warm", "Hot", "Very Hot", "Foggy", "Thunderstorm", "Sandstorm", "Flash Flood"]
    var currentweather = weathertypes[0];

    function changeDay() {
        day += 1;
    };

    return {
        get_day : function() {
            return day;
        },
        advance_day : function() {
            changeDay();
        },
        get_weather : function() {
            return currentweather;
        }
    }
})();

world.Survivors = (function() {
    var survivors = [];

    return {
      add_survivor : function(survivor) {
          survivors.add(colonist);
      },
      remove_survivor : function(survivor) {
          survivors.remove(colonist);
      },
      get_survivors : function(){
          return survivors;
      }
    };
})();

// world.Resources = (function() {
//     var water = 0;
//     var fuel = 0;
//     var food = 0;
//
//     return {
//         get_water : function() {
//             return water;
//         },
//         get_fuel : function() {
//             return fuel;
//         },
//         get_food : function() {
//             return food;
//         },
//         update_water : function (amount) {
//             water += (water + amount) >= 0 ? amount : -water;
//         },
//         update_fuel : function (amount) {
//             fuel += (fuel + amount) >= 0 ? amount : -fuel;
//         },
//         update_food : function(amount) {
//             food += (food + amount) >= 0 ? amount : -food;
//         }
//     };
// })();