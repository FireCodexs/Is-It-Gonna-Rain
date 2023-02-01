let apiKey = "bdef71253a2a393dd1af50c62ed2aa19"; //weather API key
let history = $("#history")
let today = $("#today")
let forecast = $("#forecast")

let cities = [] //here we will store the searched cities

retrieveData()


function renderCities() {
    $("#cities-count").text(cities.length)
    history.text("")
    //Render a new button element for each city
    for(i=0;i<cities.length;i++){
        let city = cities[i]
        let historyElement = $(`<button type="submit" data-value=${city} class="btn btn-secondary btn-sm"></button>`);
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
//function to store data into the localStorage
function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

//Function to take the data from the input field and inject it into the API fetch request and export the data
$("#search-button").on("click", function(event) {
    resetScreenData()
    //this IF statement will prevent a invalid response(empty field)
    let noSubmit = $('#search-input').val()
    if (!noSubmit) {
        return alert('You need to type a city!');
    }
    event.preventDefault(); //this will prevent the refresh of the page when the  button is clicked
    cityName = $("#search-input").val()
    buttonSearch(cityName)

    // Add the cities to the array
    cities.push($("#search-input").val())
    //Execute the functions
    storeCities()
    renderCities()
})

//function to retrieve data when pressing a saved city
    
$("#history").children().each(function () {
        let selector = $(this)
        console.log(selector)
            selector.on("click", function(event){
                event.preventDefault();
                buttonSearch(selector.attr("data-value"))
                resetScreenData()
        })
})

function buttonSearch(cityName) {

    //first fetch will give the basic geo info
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(cityResult => {
        //second fetch will give the times and weather forecast etc
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityResult[0].lat}&lon=${cityResult[0].lon}&units=metric&appid=${apiKey}`)
    })
    .then(response => response.json())
    .then(data => {
        today.append($(`<div>
        <h2>${data.city.name} (${moment().format('DD/MM/YYYY')}) <img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png"></h2>
        </div>`))
        //this will generate and add the data to the big card 
        today.append($(`
        <p>Temp: ${data.list[0].main.temp} °C</p>
        <p>Wind: ${data.list[0].wind.speed} KPH</p>
        <p>Humidity: ${data.list[0].main.humidity}%</p>
        `))
        //this will dynamically generate 5 cards with API data
        for(i=1;i<6;i++) {
            forecast.append(
                `<div class="col">
                <div class="card">
                  <div class="card-body">
                  <h5 class="card-title">${moment(data.list[i*7].dt, "X").format("DD/MM/YYYY")}</h5>
                    <img src="https://openweathermap.org/img/wn/${data.list[i*7].weather[0].icon}@2x.png">
                    <p class="card-text">Temp: ${data.list[i*7].main.temp} °C</p>
                    <p class="card-text">Wind: ${data.list[i*7].wind.speed} KPH</p>
                    <p class="card-text">Humidity: ${data.list[i*7].main.humidity}%</p>
                    </div>
                    </div>
              </div>`
            )
        }
        $("#after-today").append($(`<h3>5-Day Forecast:</h3>`))
    })
}
    
// This click event will reset the localStorage values
//to implement: nice looking alert pop up
$("#delete-button").on("click", function() {
    let text;
    if(confirm("This will delete all the cities you've searched for, are you sure?")){
        text = "Items deleted successfully"
        localStorage.clear()
    } else {
        text = "You did not delete the items."
    }
})


function resetScreenData() {
    today.text("")
    forecast.text("")
    $("#after-today").text("")
}
