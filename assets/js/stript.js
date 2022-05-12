const cityInput = document.querySelector('#city-search');
const weatherToday = document.querySelector('.todays-weather');
const forecastDiv = document.querySelector('.forecast');
const formSubmit = document.querySelector('.form-submit');
const cityList = document.querySelector('#searched-cities');
let listOfCities = []

if (localStorage.getItem('savedCity')) {
    listOfCities = JSON.parse(localStorage.getItem('savedCity'))
}

function init() {

    if (localStorage.getItem('savedCity')) {
        listOfCities = JSON.parse(localStorage.getItem('savedCity'))
    }
    for (let city of listOfCities) {
        cityList.innerHTML += `<button class="${city}">${city.replace('-', ' ')}</button>`
    }
}

init();


function fetchWeather(location) {
    // here is the main api call. We are searching by city name.
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1be3897da6ee591e578a9ef71854ca76&units=imperial`)
        .then(response => response.json()) // this line converts the response to JSON so our browser can read the data
        .then((data) => {
            console.log(data);
            //stores the user input as a var
            let city = location.replace(' ', '-');
            //clears the search bar
            cityInput.value = '';
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&appid=1be3897da6ee591e578a9ef71854ca76&units=imperial`)
                .then(response => response.json())
                .then((forecastData) => {
                    console.log(forecastData)

                    function displayWeather(event) {
                        weatherToday.setAttribute('style', 'border: 2px solid #000000; background-color: #3a6eb2de;') // creates the border of the weather box
                        // this grabs the data from localStorage to display on the page
                        const unixCode = new Date(data.dt * 1000);
                        const theDate = unixCode.toDateString();

                        weatherToday.innerHTML = `<h3>${theDate}</h3>
                        <h2>${data.name} <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png"></h2>
                        <h3>Current Temp: ${data.main.temp} F</h3>
                        <h3>Wind Speed: ${data.wind.speed} MPH</h3>
                        <h3>Humidity: ${data.main.humidity} %</h3>
                        <h3>UV index ${forecastData.current.uvi}</h3>`

                        // this creates the city button on the list
                        console.log(city)
                        if (!redundancyCheck(city)) {
                            return
                        }
                        saveToLocal(city)

                        cityList.innerHTML += `<button class="${city}">${data.name}</button>`
                    }
                    displayWeather();
                    displayForecast(forecastData);
                })
        })
}

function displayForecast(data) {
    forecastDiv.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const unixCode = new Date(data.daily[i].dt * 1000);
        const theDate = unixCode.toDateString();
        forecastDiv.innerHTML += `<div class="forecast-card">
        <h4>${theDate}</h4>
        <img src="https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png">
        <h4>Temp: ${data.daily[i].temp.day} F</h4>
        <h4>Humidity: ${data.daily[i].humidity} %</h4>
        </div>`
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
    //save data to localStorage under variable name of the city.
    localStorage.setItem('savedCity', JSON.stringify(listOfCities));
}


formSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    if (!cityInput.value) {
        weatherToday.innerHTML = '<p>Please enter a city name</p>'
        return
    } else {
        fetchWeather(cityInput.value.trim());
    }
})

cityList.addEventListener('click', (event) => {
    if (event.target.id == 'searched-cities') {
        console.log('not a button');
        return false
    } else {
        let citySpacedName = event.target.className.replace('-', ' ');
        fetchWeather(citySpacedName);
    }
})