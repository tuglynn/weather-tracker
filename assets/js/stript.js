var cityInput = document.querySelector('#city-search');
var weatherToday = document.querySelector('.todays-weather');
var forecastDiv = document.querySelector('.forecast');
var formSubmit = document.querySelector('.form-submit');
var cityList = document.querySelector('.searched-cities');
var listOfCities = []

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
    // here is the main api call. We are searching by city name.
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1be3897da6ee591e578a9ef71854ca76&units=imperial`)
        .then(response => response.json()) // this line converts the response to JSON so our browser can read the data
        .then(function (data) {
            console.log(data);
            //stores the user input as a var
            let city = location.replace(' ', '-');
            //clears the search bar
            cityInput.value = '';
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&appid=1be3897da6ee591e578a9ef71854ca76&units=imperial`)
                .then(response => response.json())
                .then(function (forecastData) {
                    console.log(forecastData)

                    function displayWeather(event) {
                        weatherToday.innerHTML = ''; // this clears whatever city info was in the main div
                        weatherToday.setAttribute('style', 'border: 2px solid #000000; background-color: #3a6eb2de;') // creates the border of the weather box
                        // this grabs the data from localStorage to display on the page
                        var cityName = document.createElement('h2');
                        var iconURL = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                        var iconEl = document.createElement('img')
                        iconEl.setAttribute('src', iconURL);
                        // this grabs the cities name
                        cityName.textContent = `${data.name}`;
                        weatherToday.appendChild(cityName);
                        weatherToday.appendChild(iconEl);
                        var currentTemp = document.createElement('h3');
                        // this grabs the current temperature 
                        currentTemp.textContent = `Current Temp: ${data.main.temp} F`;
                        weatherToday.appendChild(currentTemp);
                        var windSpeed = document.createElement('h3');
                        windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`
                        weatherToday.appendChild(windSpeed);
                        var humid = document.createElement('h3');
                        humid.textContent = `Humidity: ${data.main.humidity} %`;
                        weatherToday.appendChild(humid);
                        var uvIndex = document.createElement('h3');
                        uvIndex.textContent = `UV index ${forecastData.current.uvi}`;
                        weatherToday.appendChild(uvIndex);


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
                    displayForecast(forecastData);
                })
        })
}

function displayForecast(data) {
    forecastDiv.innerHTML = '';
    for (var i = 0; i < 5; i++) {

        var cardDiv = document.createElement('div');
        cardDiv.setAttribute('class', 'forecast-card');
        forecastDiv.appendChild(cardDiv);
        var dateEl = document.createElement('h4');
        var unixCode = new Date(data.daily[i].dt);
        var theDate = unixCode.toDateString();
        dateEl.textContent = theDate;
        cardDiv.appendChild(dateEl)
        var iconURL = `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;
        var iconEl = document.createElement('img')
        iconEl.setAttribute('src', iconURL);
        cardDiv.appendChild(iconEl);
        var dayTemp = document.createElement('h4');
        // this grabs the current temperature 
        dayTemp.textContent = `Temp: ${data.daily[i].temp.day} F`;
        cardDiv.appendChild(dayTemp);
        var humid = document.createElement('h4');
        humid.textContent = `Humidity: ${data.daily[i].humidity} %`;
        cardDiv.appendChild(humid);
    }
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
    console.log(event);

    if (event.path.includes('button')) {
        fetchWeather(citySpacedName);
    } else return console.log('nope')
})