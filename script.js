const mapQuestApiKey = 'fUP2ou2VguVJPbfcEp7ztHj6pLaJ49Ep';
var map = null;
var currentAudio = null;

//API to set map 
function setMap(lat, long) {
    L.mapquest.key = mapQuestApiKey;
    L.mapquest.map('map', {
        center: [lat, long],
        layers: L.mapquest.tileLayer('map'),
        zoom: 12
    });
}

if ("geolocation" in navigator) {
  getCurrentPositionAndFindCountry();
}

function getCurrentPositionAndFindCountry() {
  navigator.geolocation.getCurrentPosition(function(data) {
      const latitude = data.coords.latitude;
      const longitude = data.coords.longitude;
      setMap(latitude, longitude);
      findCountry(latitude, longitude, function(countryCode) {
        // // Save country code as a variable
        var country = countryCode;
        // var country = "RU";
        // Update HTML element with the country code
        updateCountryCode(country);
        findStations(country);
    });
    //   findCountry(latitude, longitude);
    //   console.log("Country Code:", country);
  });
}

function updateCountryCode(countryCode) {
  document.getElementById('countryCode').innerText = countryCode;
}

//API request for map and country code for radio API 
function findCountry(lat, long, callback) {
    const apiUrl = `https://www.mapquestapi.com/geocoding/v1/reverse?key=${mapQuestApiKey}&location=${lat},${long}&includeRoadMetadata=true&includeNearestIntersection=true`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            
            // Save country code as a variable
            var country = data.results[0].locations[0].adminArea1;
            callback(country);
            // return data.results[0].locations[0].adminArea1;
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}


// `https://de1.api.radio-browser.info/json/countries/${countryCode}/stations`
// `http://www.radio-browser.info/webservice/json/stations/bycountryexact/${countryCode}`
// https://de1.api.radio-browser.info/json/stations/bycountry/${countryCode}
// https://api.radio-browser.info/json/stations/bycountry/${countryCode}

//API to fetch radio stations
function findStations(countryCode){
  console.log("STATIONS", countryCode);
  if (countryCode){
    fetch(`https://de1.api.radio-browser.info/json/stations/search?countrycode=${countryCode}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // SORTING OF DATA
        console.log(data);
        const stations = data.sort((a, b) => b.clickcount - a.clickcount).slice(0, 50);
        console.log(stations);
        renderStations(stations);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  }

    // http://91.132.145.114:80/{format}/stations/bycountry/{searchterm}
}

// Function to render stations as a table list
function renderStations(stations) {
  const stationListBody = document.getElementById('stationListBody');

  // Clear existing content
  stationListBody.innerHTML = '';

  // Loop through stations and create table rows
  stations.forEach(station => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td><img class="icon" src=${station.favicon} alt="Icon">${station.name}</td>
          <td>${station.clickcount}</td>
          <td>${station.language}</td>
          <td><a href=${station.homepage}>Link</a></td>
          <td><button onclick="playAudio('${station.url_resolved}')">Play Audio</button></td>
      `;
      stationListBody.appendChild(row);
  });
}

//<audio id="audioPlayer${station.name}" src="path/to/your-audio-file.mp3"></audio>

function playAudio(audio_url) {
  if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(audio_url);
  currentAudio.play();
}