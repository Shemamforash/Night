/**
 * Created by samwe on 21/08/2016.
 */
function start() {
    outpost.Characteristics.get_new_outpost()
    world.General.advance_day();
    setInterval(updateUI, 16);
}

function updateUI() {
    if(world.General.is_world_ready()) {
        $('#fuel_label').text("Fuel: " + outpost.Characteristics.get_fuel().get_remaining() + " tanks");
        $('#food_label').text("Food: " + outpost.Characteristics.get_food().get_remaining() + " meals");
        $('#water_label').text("Water: " + outpost.Characteristics.get_water().get_remaining() + " litres");

        $("#location_label").text(outpost.Characteristics.get_type().name);

        $("#group_size_label").text(world.Survivors.get_survivors().length + " survivors");
        $("#day_number_label").text("Day " + world.General.get_day());
        $("#weather_label").text(world.General.get_weather().name);
        $("#temperature_label").text(world.General.get_temperature() + "\xB0C");
    }
}

$(window).load(start());