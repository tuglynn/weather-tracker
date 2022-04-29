var cityInput = document.querySelector('#city-search');
var weatherToday = document.querySelector('.todays-weather');
var forecastDisplay = document.querySelector('.forecast');
var formSubmit = document.querySelector('.form-submit');
var cityList = document.querySelector('.searched-cities');
var listOfCities = []

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
            listOfCities.push(city);
            console.log(city);
            //save data to localStorage under variable name of the city.
            localStorage.setItem('savedCity', JSON.stringify(listOfCities));
            cityInput.value = '';

            function displayWeather(event) {
                weatherToday.innerHTML = ''; // this clears whatever city info was in the main div
                // this grabs the data from localStorage to display on the page
                let cityWeatherData = JSON.parse(localStorage.getItem(city))
                let cityName = document.createElement('h2');
                // this grabs the cities name
                cityName.textContent = data.name;
                weatherToday.appendChild(cityName);
                let currentTemp = document.createElement('h3');
                // this grabs the current temperature 
                currentTemp.textContent = `${data.main.temp} F`;
                weatherToday.appendChild(currentTemp);
                // this creates the city button on the list
                let cityButton = document.createElement('button')
                cityButton.textContent = data.name;
                cityButton.setAttribute('class', city);
                cityList.appendChild(cityButton);
            }
            displayWeather();
        })
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