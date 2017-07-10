// Retrieve location and data from JSON on load.
$(window).on("load", function () {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            $.getJSON("https://api.darksky.net/forecast/8607de7f2b8c833a13d61d9969bd96ee/" + lat + "," + lon + "?callback=?", getForecast);
            $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyCvjcQzheZD4OKM2DPTBOoyNrtkqqp4D1o", function (googleLocation) {
                $("#location").text(googleLocation.results[3].formatted_address);
            });
        });

    } else {
        alert("Browser doesn't support geolocation!");
    }
});

var mainIcon;
var hourlyDataJson;
var hourArr = [];
var dailyDataJson;
var iconPath;
var tempConvert = function (temp) {
    return Math.round((temp - 32) * 5 / 9);
}

// Date format. 
var now = new Date();
var minutes = now.getMinutes();
if (minutes < 10)
    minutes = "0" + minutes;
var date = now.toDateString() + " " + now.getHours() + ":" + minutes;

// HTML data display from JSON.
var getForecast = function (data) {
    console.log(data);
    $("#date").text(date);
    $("#summary").html(data.currently.summary);
    $("#degree").html(tempConvert(data.currently.temperature));
    $("#real-feel").text(tempConvert(data.currently.apparentTemperature));
    $("#humidity").html(Math.round(data.currently.humidity * 100));
    $("#precip").html(Math.round(data.daily.data[0].precipProbability * 100));
    $("#wind-speed").html(Math.round(data.currently.windSpeed * 1.6));

    // Toggle button between CELSIUS and FAHRENHEIT.
    $("#degree-cels").click(function () {
        $(this).toggleClass("active");
        if ($(this).hasClass("active")) {
            $(this).html("&deg;F");
            $(".conv-deg").html(" &deg;C");
            $("#units").html(" km/h")
            $("#wind-speed").html(Math.round(data.currently.windSpeed * 1.6));
            $("#degree").html(tempConvert(data.currently.temperature));
            $("#real-feel").html(tempConvert(data.currently.apparentTemperature));
            hourlyData();
            dailyData();
        } else {
            $(this).html("&deg;C");
            $(".conv-deg").html(" &deg;F");
            $("#units").html(" mph")
            $("#wind-speed").html(Math.round(data.currently.windSpeed));
            $("#degree").html(Math.round(data.currently.temperature));
            $("#real-feel").html(Math.round(data.currently.apparentTemperature));
            hourlyData();
            dailyData();
        }
    });

    mainIcon = data.currently.icon;
    hourlyDataJson = data.hourly.data;
    dailyDataJson = data.daily.data;

    checkIcon(data.currently.icon);
    $("#main-icon").attr("src", iconPath);


    for (var i = 0; i < hourlyDataJson.length; i += 4) {
        hourArr.push(hourlyDataJson[i]);
    }

    hourlyData();
    dailyData();
};

// Check icon status from JSON and append the right icon.
function checkIcon(icon) {
    if (icon === "wind") {
        iconPath = "Icons/windy.png";
    } else if (icon === "clear-day") {
        iconPath = "Icons/sun-1.png";
    } else if (icon === "cloudy") {
        iconPath = "Icons/cloudy.png";
    } else if (icon === "clear-night") {
        iconPath = "Icons/moon-2.png";
    } else if (icon === "rain") {
        iconPath = "Icons/rain-4.png";
    } else if (icon === "snow") {
        iconPath = "Icons/snowing.png";
    } else if (icon === "sleet") {
        iconPath = "Icons/frozen-rain.png";
    } else if (icon === "fog") {
        iconPath = "Icons/fogg.png";
    } else if (icon === "partly-cloudy-day") {
        iconPath = "Icons/partly-cloudy-day.png";
    } else if (icon === "partly-cloudy-night") {
        iconPath = "Icons/partly-cloudy-night.png";
    }
};

// Display hourly temperature, icon and time dynamically.
function hourlyData() {
    for (i = 0; i < hourArr.length; i++) {
        checkIcon(hourArr[i].icon);
        $("#hourly-icon-" + i).attr("src", iconPath);
        $("#hour-" + i).html(convertUnixTime());

        if ($("#degree-cels").hasClass("active")) {
            $("#hourly-deg-" + i).html(tempConvert(hourArr[i].temperature));
        } else {
            $("#hourly-deg-" + i).html(Math.round(hourArr[i].temperature));
        }
    }
};

function convertUnixTime() {
    var date = new Date(hourArr[i].time * 1000);
    var hours = date.getHours();
    if (hours < 10)
        hours = "0" + hours;
    return hours + ':' + "00";
};

// Display daily temperature, icon and time dynamically.
function dailyData() {
    for (i = 0; i < dailyDataJson.length; i++) {
        checkIcon(dailyDataJson[i].icon);
        $("#daily-icon-" + i).attr("src", iconPath);
        $("#day-" + i).html(unixTimeToDay());

        if ($("#degree-cels").hasClass("active")) {
            $("#daily-deg-" + i).html(tempConvert(dailyDataJson[i].temperatureMax));
        } else {
            $("#daily-deg-" + i).html(Math.round(dailyDataJson[i].temperatureMax));
        }
    }
};

function unixTimeToDay() {
    var date = new Date(dailyDataJson[i].time * 1000);
    var dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return dayName[date.getDay()];
};
