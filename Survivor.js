/**
 * Created by samwe on 21/08/2016.
 */
var survivor = {};

survivor.CharacterCreator = (function() {
    var female_names = ["Alette", "Temika", "Jeri", "Melinda", "Marcia", "Corine", "Heike", "Krishna", "Letitia", "Naomi", "Yasuko", "Karie", "Grazyna", "Ethelene", "Audry", "Melda", "Katherine", "Nell"];
    var male_names = ["Hai", "Riley", "Kristoff", "Angbard", "Rob", "Alvaro", "James", "Abel", "Stephen", "Mikki", "Alexander", "Paolo", "Vladimir", "Harald", "Max", "Michael", "Emory", "Byron", "Daniel"];
    var surnames = ["Copeland", "Delgado", "Hess", "Horton", "Garrett", "Freysson", "Yang", "Blackeye", "Longscab", "Redhand", "Deepdweller", "Sungazer", "Bottomeater", "Eaton", "Koch", "Diaz", "O'connoll", "Divider"];

    var backstory = "I am a survivor.";

    //Affects resource use
    var age = helper.randomInt(50) + 10; //50y/o = 2 food, 20y/o=4, 10y/o = 3
    var gender = (helper.randomInt(2) === 1) ? "Male" : "Female";
    var weight = (gender === "Male") ? (helper.randomInt(20) + 60) : (helper.randomInt(15) + 50); //range is 50 to 80

    //Upper bound = 4, lower bound = 1
    var weight_modifier = Math.floor(weight / 10) - 4;

    //Upper bound = 4, lower bound = 1
    var age_modifier = (function() {
        switch(Math.floor(age / 10)){
            case 1:
                return 2;
            case 2:
                return 4;
            case 3:
                return 3;
            case 4:
                return 2;
            case 5:
                return 1;
            default:
                return 2;
        }
    }());

    var survivor_name = generate_name(100);

    function generate_name(i) {
        var first_name = (gender === "Male") ? (male_names[helper.randomInt(male_names.length)]) : (female_names[helper.randomInt(female_names.length)]);
        var surname = surnames[helper.randomInt(surnames.length)];
        var full_name = first_name + " " + surname;
        for(var s in survivor.CharacterManager.get_all()) {
            if(s.survivor_name === full_name) {
                if(i === 0){
                    return null;
                }
                return generate_name(i + 1);
            }
        }
        return full_name;
    }

    //Various effects
    var trait_1 = survivor.Traits.generate_new_trait();
    var trait_2 = survivor.Traits.generate_new_trait(trait_1); //Ensure trait is not identical to trait_1

    //Upper bound = 7, lower bound = 2
    var max_days_starvation = helper.randomInt(5) + 2;
    //Upper bound = 4, lower bound = 1
    var max_days_dehydration = helper.randomInt(3) + 1;

    var days_starvation = helper.randomInt(2);
    var days_dehydration = helper.randomInt(2);

    //Affected by various things
    var fuel_need = weight_modifier; //Affected by weight only
    var water_need = weight_modifier; //Affected by weight only
    var food_need = age_modifier + weight_modifier ; //Affected by weight and age

    //Upper bound = 50, lower bound = 10
    var fuel_find_skill = Math.floor(Math.random() * age_modifier * 10) + 10; //Affected by age
    var water_find_skill = Math.floor(Math.random() * age_modifier * 10) + 10; //Affected by age
    var food_find_skill = Math.floor(Math.random() * age_modifier * 10) + 10; //Affected by age

    var strength = age_modifier * weight_modifier * Math.random(); //Affected by age and gender

    var preferred_weather = [];
    var disliked_weather = [];

    var preferred_outpost = [];
    var disliked_outpost = [];

    var actions = [];
    actions.push(helper.create_function_wrapper("Find Water", function(s){
        var found = outpost.Characteristics.get_water().gather(s);
        world.Resources.get_water().increase(found.amount);
        post_event(s.survivor_name + " found " + Math.round(found.amount * 10) / 10 + " litres of water. " + found.suffix);
    }));
    actions.push(helper.create_function_wrapper("Find Food", function(s){
        var found = outpost.Characteristics.get_food().gather(s);
        world.Resources.get_food().increase(found.amount);
        post_event(s.survivor_name + " found " + Math.round(found.amount * 10) / 10 + " morsels of food. " + found.suffix);
    }));
    actions.push(helper.create_function_wrapper("Find Fuel", function(s){
        var found = outpost.Characteristics.get_fuel().gather(s);
        world.Resources.get_fuel().increase(found.amount);
        post_event(s.survivor_name + " found " + Math.round(found.amount * 10) / 10 + " tanks of fuel. " + found.suffix);
    }));

    var preferred_temperature = 17 + helper.randomInt(8);

    //Show outpost_name, trait_1, trait_2, fuel/water/food need and skill, strength
    //Tooltip shows age, gender, weight, backstory, preferred temp/weather/outpost
    return {
        survivor_name: survivor_name,
        age: age,
        gender: gender,
        weight: weight,
        backstory: backstory,
        max_days_starvation: max_days_starvation,
        max_days_dehydration: max_days_dehydration,
        days_dehydration: days_dehydration,
        days_starvation: days_starvation,
        trait_1: trait_1,
        trait_2: trait_2,
        fuel_need: fuel_need,
        water_need: water_need,
        food_need: food_need,
        fuel_find_skill: fuel_find_skill,
        water_find_skill: water_find_skill,
        food_find_skill: food_find_skill,
        strength: strength,
        preferred_weather: preferred_weather,
        disliked_weather: disliked_weather,
        preferred_outpost: preferred_outpost,
        disliked_outpost: disliked_outpost,
        preferred_temperature: preferred_temperature,
        actions: actions,
        preferred: false,
        get_action_by_name : function(name) {
            for(var i = 0; i < this.actions.length; ++i){
                if(this.actions[i].function_name === name) {
                    return this.actions[i];
                }
            }
            return null;
        },
        mark_preferred : function(b) {
            this.preferred = b;
        },
        eat : function(food_left) {
            if(food_left > 0){
                this.days_starvation = 0;
                return this.food_need;
            } else {
                this.days_starvation += 1;
                if(this.days_starvation === this.max_days_starvation){
                    survivor.CharacterManager.kill_survivor(this);
                    post_event(this.survivor_name + " has died from starvation");
                }
                return 0;
            }
        },
        drink : function(water_left) {
            if(water_left >= 0){
                this.days_dehydration = 0;
                return this.water_need;
            } else {
                days_dehydration += 1;
                if(this.days_dehydration === this.max_days_dehydration){
                    survivor.CharacterManager.kill_survivor(this);
                    post_event(this.survivor_name + " has died from thirst");
                }
                return 0;
            }
        }
    }
});

survivor.CharacterManager = (function() {
    //No effect on character
    var survivors_alive = [];
    var survivors_dead = [];

    return {
        create_survivor : function() {
            var new_char = survivor.CharacterCreator();
            new_char.trait_1.execute(new_char);
            new_char.trait_2.execute(new_char);
            survivors_alive.push(new_char);
            add_survivor_elements(new_char);
            return new_char.survivor_name + " has joined the group";
        },
        kill_survivor : function(s) {
            survivors_alive.splice(survivors_alive.indexOf(s), 1);
            survivors_dead.push(s);
            survivor_elements.remove_element(s);
            return s;
        },
        get_alive : function() {
            return survivors_alive;
        },
        get_dead : function() {
            return survivors_dead;
        },
        get_all : function() {
            return survivors_alive + survivors_dead;
        },
        get_character_by_name : function(name) {
            for(var i = 0; i < survivors_alive.length; ++i){
                if(survivors_alive[i].survivor_name === name){
                    return survivors_alive[i];
                }
            }
            return null;
        }
    };


}());



survivor.Traits = (function() {
    var all_traits = [];
    all_traits.push(helper.create_function_wrapper("Hot blooded", function(s) {
        s.preferred_temperature += 10;
    }));
    all_traits.push(helper.create_function_wrapper("Cold blooded", function(s) {
        s.preferred_temperature -= 10;
    }));
    all_traits.push(helper.create_function_wrapper("Sand rat", function(s){
        s.preferred_outpost.push(outpost.Templates.get_outpost_by_name("Wasteland"));
        s.preferred_weather.push(world.Weather.get_weather_by_name("Clear"));
    }));
    all_traits.push(helper.create_function_wrapper("Survivor", function(s){
        s.food_need -= 1;
        s.water_need -= 1;
        s.food_find_skill += 1;
        s.water_find_skill += 1;
    }));
    all_traits.push(helper.create_function_wrapper("Skinny", function(s){
        s.weight -= 1;
        s.food_need -= 1;
    }));
    all_traits.push(helper.create_function_wrapper("Obese", function(s){
        s.food_need += 1;
    }));

    return {
        generate_new_trait : function(trait) {
            var random_trait = null;
            while(random_trait === null){
                random_trait = all_traits[helper.randomInt(all_traits.length)];
                if(trait === random_trait){
                    random_trait = null;
                }
            }
            return random_trait;
        }
    };
}());