var cityInput = document.querySelector('#city-search');
var weatherToday = document.querySelector('.todays-weather');
var forecastDisplay = document.querySelector('.forecast');
var formSubmit = document.querySelector('.form-submit');
var cityList = document.querySelector('.searched-cities');


// function displayWeather() {
//     console.log('we made it here!');

// }

function fetchWeather(location) {
    console.log(location)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1be3897da6ee591e578a9ef71854ca76&units=imperial`)
        .then(response => response.json())
        .then(function (data) {
            console.log(data);
            // displayWeather();
            let cityName = document.createElement('h2');
            cityName.textContent = cityInput.value;
            weatherToday.appendChild(cityName);
            let currentTemp = document.createElement('h3');
            currentTemp.textContent = `${data.main.temp} F`;
            weatherToday.appendChild(currentTemp);
            let cityButton = document.createElement('button');
            cityButton.textContent = cityInput.value;
            cityList.appendChild(cityButton);


        })
}



formSubmit.addEventListener('click', function (event) {
    event.preventDefault();
    console.log('click');
    weatherToday.innerHTML = '';
    fetchWeather(cityInput.value);
})