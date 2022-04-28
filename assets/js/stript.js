var cityInput = document.querySelector('#city-search');
var weatherToday = document.querySelector('.todays-weather');
var forecastDisplay = document.querySelector('.forecast');
var formSubmit = document.querySelector('.form-submit');
var cityList = document.querySelector('.searched-cities');



function displayWeather() {
    weatherToday.innerHTML = ''; // this clears whatever city info was in the main div
    // this grabs the data from localStorage to display on the page
    let cityWeatherData = JSON.parse(localStorage.getItem(cityInput.value.replace(' ', '-')))
    let cityName = document.createElement('h2');
    // this grabs the cities name
    cityName.textContent = cityWeatherData.name;
    weatherToday.appendChild(cityName);
    let currentTemp = document.createElement('h3');
    // this grabs the current temperature 
    currentTemp.textContent = `${cityWeatherData.main.temp} F`;
    weatherToday.appendChild(currentTemp);
    // this creates the city button on the list
    let cityButton = document.createElement('button')
    cityButton.textContent = cityWeatherData.name;
    cityButton.setAttribute('class', cityWeatherData.name.replace(' ', '-').toLowerCase());
    cityList.appendChild(cityButton);
}

function fetchWeather(location) {
    console.log(location)
    // here is the main api call. We are searching by city name.
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1be3897da6ee591e578a9ef71854ca76&units=imperial`)
        .then(response => response.json()) // this line converts the response to JSON so our browser can read the data
        .then(function (data) {
            console.log(data);
            //save data to localStorage under variable name of the city.
            localStorage.setItem(cityInput.value.replace(' ', '-'), JSON.stringify(data));
            displayWeather();
        })
}



formSubmit.addEventListener('click', function (event) {
    event.preventDefault();
    fetchWeather(cityInput.value);
})