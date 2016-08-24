/**
 * Created by samwe on 21/08/2016.
 */
var world = {};

world.kill_random = function() {
    var rand = helper.randomInt(survivor.CharacterManager.get_alive().length);
    return survivor.CharacterManager.kill_survivor(survivor.CharacterManager.get_alive()[rand]);
};

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

world.feed_and_drink = function() {
    var preferred_survivors = [];
    var others = [];
    var s;

    for(var i = 0; i < survivor.CharacterManager.get_alive().length; ++i){
        s = survivor.CharacterManager.get_alive()[i];
        if(s.preferred){
            preferred_survivors.push(s);
        } else {
            others.push(s);
        }
    }

    shuffle(preferred_survivors);
    shuffle(others);

    for(i = 0; i < preferred_survivors.length; ++i){
        s = preferred_survivors[i];
        world.Resources.get_food().decrease(s.eat(world.Resources.get_food().get_remaining()));
        world.Resources.get_water().decrease(s.drink(world.Resources.get_water().get_remaining()));
    }
    for(i = 0; i < others.length; ++i){
        s = others[i];
        world.Resources.get_food().decrease(s.eat(world.Resources.get_food().get_remaining()));
        world.Resources.get_water().decrease(s.drink(world.Resources.get_water().get_remaining()));
    }
}

world.General = (function() {
    var day = 0;
    var temperature = 30;
    var currentweather;
    var ready = false;

    function changeDay() {
        day += 1;
        currentweather = world.Weather.get_weather();
        outpost.Characteristics.change_weather(currentweather);
        var temp_variation = Math.random() * 2 + 9;
        temperature = outpost.Characteristics.get_current_outpost().outpost_climate * temp_variation + currentweather.temperature_bonus;
        temperature = Math.floor(temperature);
        if(Math.random() < 0.4 && survivor.CharacterManager.get_alive().length < outpost.Characteristics.get_current_outpost().outpost_carrying_capacity){
            post_event(survivor.CharacterManager.create_survivor());
        } else if (Math.random() < 0.05 && survivor.CharacterManager.get_alive().length > 1) {
            var s_name = world.kill_random().survivor_name;
            post_event("Figures came in the night. They took " + s_name);
        }
        world.feed_and_drink();
        survivor_elements.reset_actions();
        ready = true;
    }

    return {
        get_day : function() {
            return day;
        },
        advance_day : function() {
            changeDay();
        },
        get_weather : function() {
            return currentweather;
        },
        get_temperature : function() {
            return temperature;
        },
        is_world_ready : function() {
        return ready;
        }
    };
}());

world.Resources = (function() {
    var water = helper.resource_creator("Water");
    water.increase(helper.randomInt(10) + 10);
    var fuel = helper.resource_creator("Fuel");
    var food = helper.resource_creator("Food");
    food.increase(helper.randomInt(5) + 5);

    return {
        get_water : function() {
            return water;
        },
        get_fuel : function() {
            return fuel;
        },
        get_food : function() {
            return food;
        }
    };
})();

world.Weather = (function() {
    function weather_constructor(name, waterbonus, foodbonus, dangerbonus, temperaturebonus) {
        return {
            weather_name: name,
            water_bonus: waterbonus,
            food_bonus: foodbonus,
            danger_bonus: dangerbonus,
            temperature_bonus: temperaturebonus
        }
    }

    //Weather ---------- Water --- Food --- Danger --- Temperature -- Chance
    //Drizzle ---------- +1 ------ 2 ------ low ------ -5 ----------- 4
    //Rainy ------------ +2 ------ 1 ------ low ------ -10 ---------- 2
    //Clear ------------ -1 ------ 0 ------ low ------ +10 ---------- 6
    //Cloudy ----------- 0 ------- 2 ------ low ------ 0 ------------ 5
    //Thunderstorm ----- +1 ------ -2 ----- high ----- -10 ---------- 2
    //Foggy ------------ 0 ------- -1 ----- med ------ -5 ----------- 3
    //Sandstorm -------- -2 ------ -3 ----- low ------ +5 ----------- 2
    //Floods ----------- +3 ------ -3 ----- high ----- 0 ------------ 1

    var weather_drizzle = weather_constructor("Drizzle", 1, 2, 0, -5);
    var weather_rainy = weather_constructor("Rainy", 2, 1, 0, -10);
    var weather_clear = weather_constructor("Clear", -1, 0, 0, 10);
    var weather_cloudy = weather_constructor("Cloudy", 0, 2, 0, 0);
    var weather_thunderstorm = weather_constructor("Thunderstorm", 1, -2, 3, -10);
    var weather_foggy = weather_constructor("Foggy", 0, -1, 2, -5);
    var weather_sandstorm = weather_constructor("Sandstorm", -2, -3, 0, 5);
    var weather_floods = weather_constructor("Floods", 3, -3, 3, 0);
    var weather_types = [weather_drizzle, weather_rainy, weather_clear, weather_cloudy, weather_thunderstorm, weather_foggy, weather_sandstorm, weather_floods];

    return {
        get_weather: function () {
            var rand = helper.randomInt(25);
            if (rand < 4) {
                return weather_drizzle;
            } else if (rand < 6) {
                return weather_rainy;
            } else if (rand < 12) {
                return weather_clear;
            } else if (rand < 17) {
                return weather_cloudy;
            } else if (rand < 19) {
                return weather_thunderstorm;
            } else if (rand < 22) {
                return weather_foggy;
            } else if (rand < 24) {
                return weather_sandstorm;
            } else {
                return weather_floods;
            }
        },
        get_weather_by_name: function(name) {
            for(var i = 0; i < weather_types.length; ++i){
                if(weather_types[i].weather_name === name){
                    return weather_types[i];
                }
            }
        }
    }
}());
