/**
 * Created by samwe on 21/08/2016.
 */
function start() {
    $(document).on("click", ".toggle_button", function(){
        $(this).toggleClass("down");
    });
    post_event(survivor.CharacterManager.create_survivor());
    outpost.Characteristics.get_new_outpost();
    world.General.advance_day();
    setInterval(updateUI, 16);
}

var survivor_elements = (function() {
    var elements = [];
    return {
        get_elements : function() {
            return elements;
        },
        add_element : function(e){
            elements.push(e);
        }
    };
}());

function post_event(event) {
    $("#event_four").text($("#event_three").text());
    $("#event_three").text($("#event_two").text());
    $("#event_two").text($("#event_one").text());
    $("#event_one").text(event);
}

function add_survivor_elements(s) {
    var $div = $("<div>", {id: s.survivor_name, "class": "survivor_div"});
    $("#middle-lower").append($div);
    $div.append("<div class=\"survivor_name\">" + s.survivor_name + "</div>");
    $div.append("<div class=\"survivor_trait\">" + s.trait_1.trait_name + "</div>");
    $div.append("<div class=\"survivor_trait\">" + s.trait_2.trait_name + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.food_need + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.water_need + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.fuel_need + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.food_find_skill + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.water_find_skill + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.fuel_find_skill + "</div>");

    var $toggle_div = $("<div>", {"class": "toggle_div"});
    $div.append($toggle_div);
    $toggle_div.append("<a class=\"toggle_button\"></a>");

    var $dropdown = $("<select>", {"class": "survivor_actions"});
    $div.append($dropdown);
    $dropdown.change(function(){
        var action = $($dropdown).find(":selected").text();
        var survivor_name = $($dropdown).find(":selected").val();
        var s = survivor.CharacterManager.get_character_by_name(survivor_name);
        s.get_action_by_name(action).execute_action(s);
    });

    for(var i = 0; i < s.actions.length; ++i){
        $dropdown.append("<option value=\"" + s.survivor_name + "\">" + s.actions[i].action_name + "</option>");
    }

    var $tooltip = $("<span>", {id: (s.survivor_name + "_tooltip"), "class": "tooltip_span"});
    //Tooltip shows age, gender, weight, backstory, preferred temp/weather/outpost
    var tooltip_text = "Age: " + s.age + "<br/>";
    tooltip_text += "Sex: " + s.gender + "<br/>";
    tooltip_text += "Weight: " + s.weight + "kg<br/>";
    tooltip_text += "Backstory: " + s.backstory + "<br/>";

    tooltip_text += "Preferred weather: <br/>";
    if(s.preferred_weather.length === 0){
        tooltip_text += "         None<br/>";
    } else {
        for (var i = 0; i < s.preferred_weather.length; ++i) {
            tooltip_text += "         " + s.preferred_weather[i].weather_name + "<br/>";
        }
    }

    tooltip_text += "Preferred environment: <br/>";
    if(s.preferred_outpost.length === 0){
        tooltip_text += "         None<br/>";
    } else {
        for (i = 0; i < s.preferred_outpost.length; ++i) {
            tooltip_text += "         " + s.preferred_outpost[i].outpost_name + "<br/>";
        }
    }

    tooltip_text += "Preferred temperature: " + s.preferred_temperature + "\xB0C";

    $tooltip.html(tooltip_text);
    $div.append($tooltip);

    survivor_elements.add_element($div);
}

function updateUI() {
    if(world.General.is_world_ready()) {
        $('#fuel_label').text("Fuel: " + outpost.Characteristics.get_fuel().get_remaining() + " tanks");
        $('#food_label').text("Food: " + outpost.Characteristics.get_food().get_remaining() + " meals");
        $('#water_label').text("Water: " + outpost.Characteristics.get_water().get_remaining() + " litres");

        $("#location_label").text(outpost.Characteristics.get_type().outpost_name);

        $("#group_size_label").text(survivor.CharacterManager.get_alive().length + " survivors");
        $("#day_number_label").text("Day " + world.General.get_day());
        $("#weather_label").text(world.General.get_weather().weather_name);
        $("#temperature_label").text(world.General.get_temperature() + "\xB0C");
    }
}

$(document).ready(start);