// global variables used as reference to map and marker
let myMap;
let myMarker;

/**
 * Initializes the starting state of the app. 
 * Creates initial map and marker using users IP Address binds event listener to search button
 */
const init = async () => {
    myMap = L.map('map', {
        zoomControl: false
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);
    
    const locationData = await getLocationData();
    updateMapWithData(locationData);
    document.querySelector('.search-button').addEventListener('click', async () => {
        const ipValue = document.querySelector('.search-input').value;
        const locationData = await getLocationData(ipValue);
        updateMapWithData(locationData);
    });
};

/**
 * Updates the map with the location data passed in. 
 * 
 */
const updateMapWithData = (locationData) => {
    if (myMarker) {
        myMap.removeLayer(myMarker);
    }
    mmyMarker = L.marker([locationData.location.lat, locationData.location.lng]).addTo(myMap);
    myMap.setView([locationData.location.lat, locationData.location.lng], 15);
    
    // retrieve the location data needed and store in array so it can be used to populate the location-info class elements
    const extractedLocData = [locationData.ip, `${locationData.location.city}, ${locationData.location.region} ${locationData.location.postalCode}`, `UTC ${locationData.location.timezone}`, locationData.isp];
    const locationElements = document.querySelectorAll('.location-info');
    locationElements.forEach((ele, index) => {
        ele.innerText = extractedLocData[index];
    });
};

/**
 * Send an api request using the ip address to retrieve the location data. If no ip address is supplied, the api will return 
 * the users location data
 */
const getLocationData =  async (ipAddress) => {
    let endPoint = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_hD34dauJUbmmiG8fP7aMw4HN0b4XQ&ipAddress=';
    if (ipAddress) {
        endPoint += ipAddress;
    }
    const response = await fetch(new URL(endPoint));
    const data = await response.json();
    return data;
};


init();
//192.212.174.101