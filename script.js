// move out or keep. create map
const mapQuestApiKey = 'fUP2ou2VguVJPbfcEp7ztHj6pLaJ49Ep';

var map = null;

function setMap(lat, long) {
    L.mapquest.key = mapQuestApiKey;

    // 'map' refers to a <div> element with the ID map
    L.mapquest.map('map', {
        center: [lat, long],
        layers: L.mapquest.tileLayer('map'),
        zoom: 12
    });
}


if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (data) {
        console.log('data', data)
        const latitude = data.coords.latitude;
        const longitude = data.coords.longitude;
        setMap(latitude, longitude);
        const countryCode = findCountry(latitude, longitude);
        // findStations(countryCode);
    })
}
// else { alert("location not shared") }

// function handleSearch() {
//     const searchInput = document.getElementById('search').value;
// }

// document.getElementById('search').addEventListener('click', handleSearch);

// document.getElementById('search').addEventListener('keypress', function (e) {
//     if (e.key === 'Enter') {
//         handleSearch();
//     }
// });

function findCountry(lat, long) {
    const apiUrl = `https://www.mapquestapi.com/geocoding/v1/reverse?key=${mapQuestApiKey}&location=${lat},${long}&includeRoadMetadata=true&includeNearestIntersection=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data.results[0].locations[0].adminArea1;
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

function get_radiobrowser_base_urls() {
    fetch ('http://all.api.radio-browser.info/json/servers')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
    })


    // return new Promise((resolve, reject) => {
    //     var request = new XMLHttpRequest()
    //     request.open('GET', 'http://all.api.radio-browser.info/json/servers', true);
    //     request.onload = function () {
    //         if (request.status >= 200 && request.status < 300) {
    //             var items = JSON.parse(request.responseText).map(x => "https://" + x.name);
    //             resolve(items);
    //         } else {
    //             reject(request.statusText);
    //         }
    //     }
    //     request.send();
    // });
}

// function get_radiobrowser_base_url_random() {
//     return get_radiobrowser_base_urls().then(hosts => {
//         var item = hosts[Math.floor(Math.random() * hosts.length)];
//         return item;
//     });
// }

const countryCode = "US"

function findStations(){
    fetch`https://de1.api.radio-browser.info/json/countries/${countryCode}/stations`, {
        headers: {
            'Accept': 'application/json'
        }
    }
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
    // http://91.132.145.114:80/{format}/stations/bycountry/{searchterm}
    // use inputed country to find a radio station and then get it to play audio
}

// get_radiobrowser_base_url_random().then((x) => {
//     console.log("-", x);
//     return get_radiobrowser_server_config(x);
// }).then(config => {
//     console.log("config:", config);
// });