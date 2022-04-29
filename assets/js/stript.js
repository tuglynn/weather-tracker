var cityInput = document.querySelector('#city-search');
var weatherToday = document.querySelector('.todays-weather');
var forecastDisplay = document.querySelector('.forecast');
var formSubmit = document.querySelector('.form-submit');
var cityList = document.querySelector('.searched-cities');
var listOfCities = []

var todaysWeatherArray = ['.name', '.weather.icon', '`${.main.temp} F`', '.main.feels_like', '.wind.speed', '.main.humidity', '.main.temp_min', '.main.temp_max', ]
/* array of data:
main page
city name, date, icon => (weather.icon)???
temp, feels_like wind speed(wind[speed]), humidity, uv index, temp_max, temp_min,
5day forecast
date, icon
temp, wind, humidity    
 */

if (localStorage.getItem('savedCity')) {
    listOfCities = JSON.parse(localStorage.getItem('savedCity'))
}

function init() {
    let storedCities = JSON.parse(localStorage.getItem('savedCity'))
    if (storedCities == null) return;
    console.log(storedCities);
    for (let city of storedCities) {
        let cityButton = document.createElement('button');
        cityButton.textContent = city.replace('-', ' ');
        cityButton.setAttribute('class', city);
        cityList.appendChild(cityButton);
    }
}

init();


function fetchWeather(location) {

    console.log(location)
    // here is the main api call. We are searching by city name.
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1be3897da6ee591e578a9ef71854ca76&units=imperial`)
        .then(response => response.json()) // this line converts the response to JSON so our browser can read the data
        .then(function (data) {
            console.log(data);

            let city = location.replace(' ', '-');

            cityInput.value = '';

            function displayWeather(event) {
                weatherToday.innerHTML = ''; // this clears whatever city info was in the main div
                weatherToday.setAttribute('style', 'border: 2px solid #000000;')
                // this grabs the data from localStorage to display on the page
                let cityWeatherData = JSON.parse(localStorage.getItem(city))
                let cityName = document.createElement('h2');
                var iconURL = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                var iconEl = document.createElement('img')
                iconEl.setAttribute('src', iconURL);
                // this grabs the cities name
                cityName.textContent = `${data.name}`;
                weatherToday.appendChild(cityName);
                weatherToday.appendChild(iconEl);
                let currentTemp = document.createElement('h3');
                // this grabs the current temperature 
                currentTemp.textContent = `Current Temp: ${data.main.temp} F`;
                weatherToday.appendChild(currentTemp);
                let windSpeed = document.createElement('h3');
                windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`
                weatherToday.appendChild(windSpeed);
                let humid = document.createElement('h3');
                humid.textContent = `Humidity: ${data.main.humidity} %`;
                weatherToday.appendChild(humid);


                // this creates the city button on the list
                console.log(city)
                if (!redundancyCheck(city)) {
                    console.log('the limit does not exist (actually this city is in the array already)')
                    return
                }
                saveToLocal(city)

                let cityButton = document.createElement('button')
                cityButton.textContent = data.name;
                cityButton.setAttribute('class', city);
                cityList.appendChild(cityButton);
            }
            displayWeather();
        })
}

function redundancyCheck(city) {
    for (let i = 0; i < listOfCities.length; i++) {
        if (listOfCities[i].toLowerCase() === city.toLowerCase()) {
            return false
        }
    }

    return true
}



function saveToLocal(city) {
    listOfCities.push(city);
    console.log(city);
    //save data to localStorage under variable name of the city.
    localStorage.setItem('savedCity', JSON.stringify(listOfCities));
}


formSubmit.addEventListener('click', function (event) {
    event.preventDefault();
    fetchWeather(cityInput.value.trim());
})

cityList.addEventListener('click', function (event) {
    let citySpacedName = event.target.className.replace('-', ' ');
    console.log(citySpacedName);
    fetchWeather(citySpacedName);
})