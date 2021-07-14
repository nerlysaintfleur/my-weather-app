let weather = {
    cityName: document.querySelector("#city-name"),
    tempValue: undefined,
    tempElement: document.querySelector("#temp-text"),
    feelLike: document.querySelector(".forecast02"),
    precipitation: document.querySelector(".forecast03"),
    description: document.querySelector(".forecast01"),
    windSpeed: document.querySelector(".forecast04"),

    maxTemp: [],
    minTemp: [],
    dateElement: document.querySelector("#date-time-text"),
    iconElement: document.querySelector("#weather-icon"),

}
let currentPosition = {
    lat: undefined,
    lon: undefined,
}
let api = {
    city: "Ottawa",
    urlCurrent: undefined,
    urlSearch: undefined,
    apiKey: "11d02a27338da60451df3648cacd8fa4",


}
function formatDay (timestamp){
    let date = new Date(timestamp*1000);
    let day = date.getDay();
    let days = [
        "SUN",
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT"
    ];

    return days[day];
}

function formatDate(timestamp){
    //calculate date
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10){
        hours=`0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10){
        minutes=`0${minutes}`;
    }
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    let day = days[date.getDay()];

    return `Last updated: ${day} ${hours}:${minutes}`;
}
function onPageLoad() {
    api.urlSearch = `https://api.openweathermap.org/data/2.5/weather?q=${api.city}&units=metric&appid=${api.apiKey}`

    axios.get(api.urlSearch)
  .then(function (response) {
    document.querySelector(".alert").style.visibility = "hidden";
    document.querySelector(".alert").style.animation = " ";
    showTemp(response);
  })
  .catch(function (error) {
    // handle error
    document.querySelector(".alert").style.animationPlayState = "running";
    document.querySelector(".alert").style.visibility = "visible";
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}
function searchCity(event) {
    event.preventDefault();
    let input = document.querySelector("#search-city");
    api.city = input.value;
    api.urlSearch = `https://api.openweathermap.org/data/2.5/weather?q=${api.city}&units=metric&appid=${api.apiKey}`;

    axios.get(api.urlSearch)
  .then(function (response) {
    document.querySelector(".alert").style.visibility = "hidden";
    document.querySelector(".alert").style.animation = " ";
    showTemp(response);
  })
  .catch(function (error) {
    // handle error
    document.querySelector(".alert").style.animationPlayState = "running";
    document.querySelector(".alert").style.visibility = "visible";
    //alert("Enter valid city name!")
    console.log(error);
  })
  .then(function () {
    // always executed
    
  });
}
function getForecast(coordinates){
    console.log(coordinates);

    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${api.apiKey}&units=metric`;
    console.log(apiUrl);
    axios.get(apiUrl).then(showForecast);
}
function reset_animation() {
  var warning = document.querySelector('.alert');
  warning.style.animation = 'none';
  warning.offsetHeight; /* trigger reflow */
  warning.style.animation = null; 
}
function showTemp(response) {
    console.log(response.data);
    weather.tempValue = Math.round(response.data.main.temp);

    weather.iconElement.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    weather.iconElement.setAttribute("alt",`http://openweathermap.org/img/wn/${response.data.weather[0].description}`);
    weather.dateElement.innerHTML = formatDate(response.data.dt*1000);
    weather.cityName.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
    weather.tempElement.innerHTML = `${weather.tempValue}`;
    weather.description.innerHTML = `${response.data.weather[0].description}`;
    weather.feelLike.innerHTML = `Feels Like: ${Math.round(response.data.main.feels_like)}°`;
    weather.precipitation.innerHTML = `Precipitation: ${response.data.main.humidity}%`;
    weather.windSpeed.innerHTML = `Wind Speed: ${Math.round(response.data.wind.speed)} km/h`;    
    getForecast(response.data.coord);
    reset_animation();
}
function showForecast(response){
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class="row d-flex justify-content-center">`;
    
    forecast.forEach(function (forecastDay, index) {
        if (index < 5){
        weather.maxTemp[index] = Math.round(forecastDay.temp.max);
        weather.minTemp[index] = Math.round(forecastDay.temp.min);

        forecastHTML =
        forecastHTML +
        `
        <div class="col-2">
            <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
            <img
            src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
            alt=""
            width="60"
            />
            <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max" id="max${index}"> ${Math.round(forecastDay.temp.max)}° </span>
            <span class="weather-forecast-temperature-min" id="min${index}"> ${Math.round(forecastDay.temp.min)}° </span>
            </div>
        </div>
    `;
    }  
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}
function retrievePosition(position) {
    currentPosition.lat = position.coords.latitude;
    currentPosition.lon = position.coords.longitude;

    api.urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${currentPosition.lat}&lon=${currentPosition.lon}&units=metric&appid=${api.apiKey}`;
    axios.get(api.urlCurrent).then(showTemp);
}
function celsiusToFarenheit(event) {
    event.preventDefault();
    weather.tempElement.innerHTML = `${(Math.round(weather.tempValue * 9 / 5) + 32)}`;
    weather.feelLike.innerHTML = `Feels Like: ${Math.round((((weather.tempValue) * 9 / 5) + 32))}°`;

    for (let i = 0; i < 5; i++) {
            let forecastTempMax = document.querySelector(`#max${i}`);
            forecastTempMax.innerHTML = `${Math.round(((weather.maxTemp[i]) * 9 / 5) + 32)}°`;
        }
    console.log(weather.maxTemp);
    for (let i = 0; i < 5; i++) {
            let forecastTempMin = document.querySelector(`#min${i}`);
            forecastTempMin.innerHTML = `${Math.round(((weather.minTemp[i]) * 9 / 5) + 32)}°`;
    }
    console.log("you converted to farenheit");
}
function farenheitToCelsius(event) {
    event.preventDefault();
    weather.tempElement.innerHTML = `${weather.tempValue}`;
    weather.feelLike.innerHTML = `Feels Like: ${Math.round(weather.tempValue)}°`;
    
    for (let i = 0; i < 5; i++) {
            let forecastTempMax = document.querySelector(`#max${i}`);
            forecastTempMax.innerHTML = `${Math.round(weather.maxTemp[i])}°`;
        }
    console.log(weather.maxTemp);
    for (let i = 0; i < 5; i++) {
            let forecastTempMin = document.querySelector(`#min${i}`);
            forecastTempMin.innerHTML = `${Math.round(weather.minTemp[i])}°`;
    }
    console.log("you converted to celsius");
}
function currentLocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(retrievePosition);
}

onPageLoad();
navigator.geolocation.getCurrentPosition(retrievePosition);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let celsiusLink = document.querySelector("#celsius-link");
let farenheitLink = document.querySelector("#farenheit-link");

celsiusLink.addEventListener("click", farenheitToCelsius);
farenheitLink.addEventListener("click", celsiusToFarenheit);

let retrieveCurrentLocation = document.querySelector(".bi-geo-alt");
retrieveCurrentLocation.addEventListener("click", currentLocation);


