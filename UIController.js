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
        },
        remove_element : function(s){
            for(var i = 0; i < elements.length; ++i){
                if(elements[i].attr("id") === s.survivor_name){
                    elements[i].remove();
                    break;
                }
            }
        },
        reset_actions : function(){
            $(".survivor_actions").prop("disabled", false);
            $(".survivor_actions").val("original");
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
    $div.append("<div class=\"survivor_trait\">" + s.trait_1.function_name + "</div>");
    $div.append("<div class=\"survivor_trait\">" + s.trait_2.function_name + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.food_need + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.water_need + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.fuel_need + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.food_find_skill + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.water_find_skill + "</div>");
    $div.append("<div class=\"survivor_resource\">" + s.fuel_find_skill + "</div>");

    var $toggle_div = $("<div>", {"class": "toggle_div"});
    $div.append($toggle_div);
    var $toggle_button = $("<a>", {"class": "toggle_button"});
    $toggle_button.click(function() {
            s.mark_preferred(!s.get_preferred());
        }
    );
    $toggle_div.append($toggle_button);

    var $dropdown = $("<select>", {"class": "survivor_actions"});
    $div.append($dropdown);
    $dropdown.change(function(){
        var action = $($dropdown).find(":selected").text();
        var survivor_name = $($dropdown).find(":selected").val();
        var s = survivor.CharacterManager.get_character_by_name(survivor_name);
        s.get_action_by_name(action).execute(s);
        $dropdown.prop("disabled", true);
    });

    $dropdown.append("<option selected disabled hidden value=\"original\">Choose activity</option>");

    for(var i = 0; i < s.actions.length; ++i){
        $dropdown.append("<option value=\"" + s.survivor_name + "\">" + s.actions[i].function_name + "</option>");
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
        $('#fuel_label').text("Fuel: " + Math.floor(world.Resources.get_fuel().remaining) + " tanks");
        $('#food_label').text("Food: " + Math.floor(world.Resources.get_food().remaining) + " meals");
        $('#water_label').text("Water: " + (Math.round(world.Resources.get_water().remaining * 10) / 10) + " litres");

        $("#location_label").text(outpost.Characteristics.get_current_outpost().outpost_name);

        $("#group_size_label").text(survivor.CharacterManager.get_alive().length + " survivors");
        $("#day_number_label").text("Day " + world.General.get_day());
        $("#weather_label").text(world.General.get_weather().weather_name);
        $("#temperature_label").text(world.General.get_temperature() + "\xB0C");
    }
}

$(document).ready(start);