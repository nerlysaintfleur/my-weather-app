let weather = {
    cityName: document.querySelector("#city-name"),
    tempValue: undefined,
    tempElement: document.querySelector("#temp-text"),
    feelLike: document.querySelector(".forecast01"),
    humidity: document.querySelector(".forecast02"),
    description: document.querySelector(".forecast03"),
    minMaxTemp: document.querySelector(".forecast04"),
    minTemp: undefined,
    maxTemp: undefined,
    dateElement: document.querySelector("#date-time-text"),
    iconElement: document.querySelector("#weather-icon"),

}
let currentPosition = {
    lat: undefined,
    lon: undefined,
}
let api = {
    city: undefined,
    urlCurrent: undefined,
    urlSearch: undefined,
    apiKey: "11d02a27338da60451df3648cacd8fa4",


}
function formatDate(timestamp){
    //calculate date
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10){
        hours=`0${minutes}`;
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
function searchCity(event) {
    event.preventDefault();
    let input = document.querySelector("#search-city");
    api.city = input.value;
    api.urlSearch = `https://api.openweathermap.org/data/2.5/weather?q=${api.city}&units=metric&appid=${api.apiKey}`

    axios.get(api.urlSearch)
  .then(function (response) {
    document.querySelector(".alert").style.visibility = "hidden";
    document.querySelector(".alert").style.animation = " ";
    showTemp(response);
    console.log(response);
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
function reset_animation() {
  var warning = document.querySelector('.alert');
  warning.style.animation = 'none';
  warning.offsetHeight; /* trigger reflow */
  warning.style.animation = null; 
}
function showTemp(response) {
    console.log(response.data);
    weather.tempValue = Math.round(response.data.main.temp);
    weather.minTemp = Math.round(response.data.main.temp_min);
    weather.maxTemp = Math.round(response.data.main.temp_max);

    weather.iconElement.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    weather.iconElement.setAttribute("alt",`http://openweathermap.org/img/wn/${response.data.weather[0].description}`);
    weather.dateElement.innerHTML = formatDate(response.data.dt*1000);
    weather.cityName.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
    weather.tempElement.innerHTML = `${weather.tempValue}`;
    weather.feelLike.innerHTML = `Feels Like: ${Math.round(response.data.main.feels_like)}°`;
    weather.humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
    weather.description.innerHTML = `Type: ${response.data.weather[0].description}`;
    weather.minMaxTemp.innerHTML = `Hightest: ${weather.maxTemp}°  Lowest: ${weather.minTemp}°`;
    reset_animation();
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
    weather.minMaxTemp.innerHTML = `Hightest: ${Math.round(((weather.maxTemp) * 9 / 5) + 32)}°  Lowest: ${Math.round(((weather.minTemp) * 9 / 5) + 32)}°`;

    console.log("you converted to farenheit");
}
function farenheitToCelsius(event) {
    event.preventDefault();
    weather.tempElement.innerHTML = `${weather.tempValue}`;
    weather.feelLike.innerHTML = `Feels Like: ${Math.round(weather.tempValue)}°`;
    weather.minMaxTemp.innerHTML = `Hightest: ${weather.maxTemp}°  Lowest: ${weather.minTemp}°`;

    console.log("you converted to celsius");
}
function currentLocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(retrievePosition);
}


navigator.geolocation.getCurrentPosition(retrievePosition);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let celsiusLink = document.querySelector("#celsius-link");
let farenheitLink = document.querySelector("#farenheit-link");

celsiusLink.addEventListener("click", farenheitToCelsius);
farenheitLink.addEventListener("click", celsiusToFarenheit);

let retrieveCurrentLocation = document.querySelector(".bi-geo-alt");
retrieveCurrentLocation.addEventListener("click", currentLocation);
