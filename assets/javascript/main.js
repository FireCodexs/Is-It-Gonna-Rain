let apiKey = "bdef71253a2a393dd1af50c62ed2aa19"; //weather API key
let history = $("#history")
let today = $("#today")

let cities = [] //here we will store the searched cities

retrieveData()


function renderCities() {
    $("#cities-count").text(cities.length)

    //Render a new button element for each city
    for(i=0;i<cities.length;i++){
        let city = cities[i]
        let historyElement = $('<button type="submit" class="btn btn-secondary btn-sm"></button>');
        history.append(historyElement)
        historyElement.text(city)
    }
}

function retrieveData() {
    //Get stored cities from localStorage
    // Parsing the JSON string to an object
    let storedCities = JSON.parse(localStorage.getItem("cities"))
    if(storedCities !== null) {
        cities = storedCities
    }

    renderCities()
}
//function to store data into the localstorage
function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

//Function to take the data from the input field and inject it into the API fetch request and export the data
$("#search-button").on("click", function(event) {
    //this IF statement will prevent a invalid response(empty field)
    let noSubmit = $('#search-input').val()
    if (!noSubmit) {
        return alert('You need to type a city!');
    }
    event.preventDefault(); //this will prevent the refresh of the page when the  button is clicked
    
//first fetch will give the basic geo info
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${$("#search-input").val()}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(cityResult => {
        console.log(cityResult[0]);
//second fetch will give the times and weather forecast etc
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityResult[0].lat}&lon=${cityResult[0].lon}&appid=${apiKey}`)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        console.log(data.city.coord.lat)
        today.append($(`<div>
        <h2>${data.city.name} (${moment().format('DD/MM/YYYY')})</h2>
        </div>`))
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data.city.coord.lat}&lon=${data.city.coord.lon}&units=metric&appid=${apiKey}`)
    })
    .then(response => response.json())
    .then(weather => {
        console.log(weather)
        today.append($(`
        <p>Temp: ${weather.main.temp}</p>
        <p>Wind: ${weather.wind.speed} KPH</p>
        <p>Humidity: ${weather.main.humidity}%</p>
        `))
    })

        // <p>Temp: 13.63*C</p>
        // <p>Wind: 1.7 KPH</p>
        // <p>Humidity: 84%</p>

    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    // })


    // Add the cities to the array
    cities.push($("#search-input").val())
    storeCities()
    renderCities()
})

function todayData() {

}














//to add a CLEAR ALL ELEMENTS button
