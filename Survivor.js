/**
 * Created by samwe on 21/08/2016.
 */
var survivor = {};

survivor.CharacterCreator = (function() {
    var female_names = [];
    var male_names = [];
    var surnames = [];

    var backstory = "I am a survivor.";

    //Affects resource use
    var age = Math.randomInt(50) + 10; //50y/o = 2 food, 20y/o=4, 10y/o = 3
    var gender = (Math.randomInt(2) === 1) ? "Male" : "Female";
    var weight = (gender === "Male") ? (Math.randomInt(20) + 60) : (Math.randomInt(15) + 50); //range is 50 to 80
    var weight_modifier = Math.floor(weight / 10);
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
            case 50:
                return 1;
            default:
                return 2;
        }
    }());

    var survivor_name = generate_name(100);

    function generate_name(i) {
        var first_name = (gender === "Male") ? (male_names[Math.randomInt(male_names.length)]) : (female_names[Math.randomInt(female_names.length)]);
        var surname = surnames[Math.randomInt(surnames.length)];
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

    //Affected by various things
    var fuel_need = weight_modifier; //Affected by weight only
    var water_need = weight_modifier; //Affected by weight only
    var food_need = age_modifier * weight_modifier ; //Affected by weight and age

    var fuel_find_skill = Math.random() * age_modifier; //Affected by age
    var water_find_skill = Math.random() * age_modifier; //Affected by age
    var food_find_skill = Math.random() * age_modifier; //Affected by age

    var strength = age_modifier * weight_modifier * Math.random(); //Affected by age and gender

    var preferred_weather = [];
    var disliked_weather = [];

    var preferred_outpost = [];
    var disliked_outpost = [];

    var preferred_temperature = 17 + Math.randomInt(8);

    return {
        survivor_name: survivor_name,
        age: age,
        gender: gender,
        backstory: backstory,
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
        preferred_temperature: preferred_temperature
    }
});

survivor.CharacterManager = (function() {
    //No effect on character
    var survivors_alive = [];
    var survivors_dead = [];

    return {
        create_survivor : function() {
            var new_char = survivor.CharacterCreator();
            new_char.trait_1.execute_trait(new_char);
            new_char.trait_2.execute_trait(new_char);
            survivors_alive.push(new_char);
            return new_char;
        },
        kill_survivor : function(s) {
            survivors_alive.remove(s);
            survivors_dead.push(s);
        },
        get_alive : function() {
            return survivors_alive;
        },
        get_dead : function() {
            return survivors_dead;
        },
        get_all : function() {
            return survivors_alive + survivors_dead;
        }
    };


}());



survivor.Traits = (function() {
    function trait_constructor(n, f){
        return {
            trait_name: n,
            execute_trait: f
        }
    }

    var all_traits = [];
    all_traits.push(trait_constructor("Hot blooded", function(s) {
        s.preferred_temperature += 10;
    }));
    all_traits.push(trait_constructor("Cold blooded", function(s) {
        s.preferred_temperature -= 10;
    }));
    all_traits.push(trait_constructor("Sand rat", function(s){
        s.preferred_outpost.push(outpost.Templates.get_outpost_by_name("Wasteland"));
        s.preferred_weather.push(world.Weather.get_weather_by_name("Clear"));
    }));
    all_traits.push(trait_constructor("Survivor", function(s){
        s.food_need -= 1;
        s.water_need -= 1;
        s.food_find_skill += 1;
        s.water_find_skill += 1;
    }));
    all_traits.push(trait_constructor("Skinny", function(s){
        s.weight -= 1;
        s.food_need -= 1;
    }));
    all_traits.push(trait_constructor("Obese", function(s){
        s.food_need += 1;
    }));

    return {
        generate_new_trait : function(trait) {
            var random_trait = null;
            while(random_trait === null){
                random_trait = all_traits[Math.randomInt(all_traits.length)];
                if(trait === random_trait){
                    random_trait = null;
                }
            }
            return random_trait;
        }
    };
}());