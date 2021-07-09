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
function updateDateTime(current) {
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    let now = new Date();
    current = `${days[now.getDay()]} ${now.getHours()}:${(now.getMinutes() < 10 ? '0' : '') + now.getMinutes()}`;

    return current;
}
function searchCity(event) {
    event.preventDefault();
    let input = document.querySelector("#search-city");
    api.city = input.value;
    api.urlSearch = `https://api.openweathermap.org/data/2.5/weather?q=${api.city}&units=metric&appid=${api.apiKey}`

    if (api.urlSearch !== undefined) {
        axios.get(api.urlSearch).then(showTemp);
    } else {
        alert("Please enter a valid city!")
    }

}
function showTemp(response) {
    console.log(response.data);
    weather.tempValue = Math.round(response.data.main.temp);
    weather.minTemp = Math.round(response.data.main.temp_min);
    weather.maxTemp = Math.round(response.data.main.temp_max);

    weather.cityName.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
    weather.tempElement.innerHTML = `${weather.tempValue}`;
    weather.feelLike.innerHTML = `Feels Like: ${Math.round(response.data.main.feels_like)}°`;
    weather.humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
    weather.description.innerHTML = `Type: ${response.data.weather[0].description}`;
    weather.minMaxTemp.innerHTML = `Hightest: ${weather.maxTemp}°  Lowest: ${weather.minTemp}°`;

}
function showCurrentTemp(response) {
    console.log(response.data);
    weather.tempValue = Math.round(response.data.main.temp);
    weather.minTemp = Math.round(response.data.main.temp_min);
    weather.maxTemp = Math.round(response.data.main.temp_max);

    weather.cityName.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
    weather.tempElement.innerHTML = `${weather.tempValue}`;
    weather.feelLike.innerHTML = `Feels Like: ${Math.round(response.data.main.feels_like)}°`;
    weather.humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
    weather.description.innerHTML = `Type: ${response.data.weather[0].description}`;
    weather.minMaxTemp.innerHTML = `Hightest: ${weather.maxTemp}°  Lowest: ${weather.minTemp}°`;
}
function retrievePosition(position) {
    currentPosition.lat = position.coords.latitude;
    currentPosition.lon = position.coords.longitude;

    api.urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${currentPosition.lat}&lon=${currentPosition.lon}&units=metric&appid=${api.apiKey}`;
    axios.get(api.urlCurrent).then(showCurrentTemp);
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


let currentDate = document.querySelector("#date-time-text");
currentDate.innerHTML = updateDateTime();

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let celsiusLink = document.querySelector("#celsius-link");
let farenheitLink = document.querySelector("#farenheit-link");

celsiusLink.addEventListener("click", farenheitToCelsius);
farenheitLink.addEventListener("click", celsiusToFarenheit);

let retrieveCurrentLocation = document.querySelector(".bi-geo-alt");
retrieveCurrentLocation.addEventListener("click", currentLocation);
