document.getElementById("search-button").addEventListener("click", (event) => {
    let cityName = document.getElementById("city").value;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=f33a26ed559de7a11743569e84a3db0e`
      )
      .then((forecastResponse) => {
        console.log(forecastResponse.data);
        let lat = forecastResponse.data.city.coord.lat;
        let lon = forecastResponse.data.city.coord.lon;
  
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=f33a26ed559de7a11743569e84a3db0e`
          )
          .then((weatherResponse) => {
            console.log(weatherResponse.data);
            //city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
            let currentTemp = weatherResponse.data.current.temp;
            let currentHumidity = weatherResponse.data.current.humidity;
            let currentWindSpeed = weatherResponse.data.current.wind_speed;
            let currentUVI = weatherResponse.data.current.uvi;
            let currentIcon = weatherResponse.data.current.weather[0].icon;
            let currentIconURL = `http://openweathermap.org/img/w/${currentIcon}.png`;
            let currentCityName = forecastResponse.data.city.name;
            let currentDate = weatherResponse.data.current.dt;
            let currentDateFormatted = moment
              .unix(currentDate)
              .format("MM/DD/YYYY");
            let currentUVIColor = "";
            if (currentUVI < 3) {
              currentUVIColor = "green";
            } else if (currentUVI < 6) {
              currentUVIColor = "yellow";
            } else if (currentUVI < 8) {
              currentUVIColor = "orange";
            } else if (currentUVI < 11) {
              currentUVIColor = "red";
            } else {
              currentUVIColor = "purple";
            }
            let currentUVIHTML = `<span class="badge badge-pill" style="background-color: ${currentUVIColor}; color: black">${currentUVI}</span>`;
  
            document.getElementById("weather").innerHTML = `<div class="card">
              <div class="card-body">
                  <h5 class="card-title">${currentCityName} (${currentDateFormatted}) <img src="${currentIconURL}"></h5>
                  <p class="card-text">Temperature: ${currentTemp} °F</p>
                  <p class="card-text">Humidity: ${currentHumidity}%</p>
                  <p class="card-text">Wind Speed: ${currentWindSpeed} MPH</p>
                  <p class="card-text">UV Index: ${currentUVIHTML}</p>
              </div>
            </div>`;

            let forecastArray = []
            let weatherday1 = weatherResponse.data.daily[1]
            let weatherday2 = weatherResponse.data.daily[2]
            let weatherday3 = weatherResponse.data.daily[3]
            let weatherday4 = weatherResponse.data.daily[4]
            let weatherday5 = weatherResponse.data.daily[5]
            forecastArray.push(weatherday1, weatherday2, weatherday3, weatherday4, weatherday5)
            console.log(forecastArray)
            
            document.getElementById("forecast").innerHTML = "";
            
            forecastArray.forEach(day => {
                document.getElementById('forecast').innerHTML += `
                  <div class="row">
                    <div class="col s12 m7">
                      <div class="card">
                        <div class="card-image">
                          <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png">
                          <span class="card-title">${moment.unix(day.dt).format("MM/DD/YYYY")}</span>
                        </div>
                        <div class="card-content">
                          <p>Temp: ${day.temp.day} °F</p>
                          <p>Humidity: ${day.humidity}%</p>
                          <p>Wind Speed: ${day.wind_speed} MPH</p>
                          <p>UV Index: ${day.uvi}</p>
                        </div>
                      </div>
                    </div>
                  </div>`;
              });
          });
      });
  });