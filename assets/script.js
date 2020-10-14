
//start with empty array
let cities = [];
init();
searchClicker();

//run function to pull saved cities from local storage and fill array with it
function init() {
    let previousCities = JSON.parse(localStorage.getItem("previousCities"));

    if (previousCities !== null) {
        cities = previousCities
    }
}

//sets localstorage item to cities array 
function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

//on click function for main search bar
function searchClicker() {
    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        city = $(this).prev().val().trim()

        //push the city user entered into cities array 
        cities.push(city);
        //return from function early if form is blank
        if (city === "") {
            return;
        }
        APIcalls();
        storeCities();
    })
}
//runs API call
function APIcalls() {

    url = "https://api.openweathermap.org/data/2.5/forecast?q=";
    currenturl = "https://api.openweathermap.org/data/2.5/weather?q=";
    APIkey = "3a9ac6f6785a3628401dcd020f39f049";
    queryurl = url + city + APIkey;
    current_weather_url = currenturl + city + APIkey;

    $("#city").append(city);

    //function to display data in main div 
    $.ajax({
        url: current_weather_url,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${response.coord.lat}&lon=${response.coord.lon}&exclude=minutely,hourly${APIkey}`,
            method: "GET"
        }).then(function (UVresponse) {
            console.log(UVresponse)
            
            $("#temperature").append(`<p> Temperature` + response.main.temp + `  °F </p>`);
            $("#humididty").append(`<p> Humidity` + response.main.humidity + `  % </p>`);
            $("#windSpeed").append(`<p> Wind Speed` + response.wind.spedd + `  MPH </p>`);
            
            $("#uvIndex").html(`<p> UV Index: ` + UVresponse.current.uvi);
            $("#icon").attr({
                "src": "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png",
                "height": "150px", "width": "150px"
            });
            if (UVresponse.current.uvi > 8) { $("#today_UV_Index").css({ "background-color": "red" }) }
            if (UVresponse.current.uvi > 7 && UVresponse.current.uvi < 8) { $("#today_UV_Index").css({ "background-color": "orange" }) }
            if (UVresponse.current.uvi < 7) { $("#today_UV_Index").css({ "background-color": "lightgreen" }) }
        });
    })
}



















