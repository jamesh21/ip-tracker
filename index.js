// global variables used as reference to map and marker
let myMap;
let myMarker;
let myCustomMarker;
/**
 * Initializes the starting state of the app.
 * Creates initial map and marker using users IP Address binds event listener to search button
 */
const init = async () => {
    myMap = L.map("map", {
        zoomControl: false,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(myMap);
    myCustomMarker = L.icon({
        iconUrl: "images/icon-location.svg",
        iconSize: [38, 50],
    });
    const locationData = await getLocationData();
    if (locationData) {
        updateMapWithData(locationData);
    }

    document
        .querySelector(".search-button")
        .addEventListener("click", async () => {
            const ipValue = document.querySelector(".search-input").value;
            const locationData = await getLocationData(ipValue);
            if (locationData) {
                updateMapWithData(locationData);
            }
        });
    document
        .querySelector(".popup-button")
        .addEventListener("click", async () => {
            document.querySelector(".popup-container").style.display = "none";
        });
};

/**
 * Updates the map with the location data passed in.
 */
const updateMapWithData = (locationData) => {
    if (myMarker) {
        myMap.removeLayer(myMarker);
    }
    myMarker = L.marker(
        [locationData.location.lat, locationData.location.lng],
        { icon: myCustomMarker }
    ).addTo(myMap);
    myMap.setView([locationData.location.lat, locationData.location.lng], 15);

    // retrieve the location data needed and store in array so it can be used to populate the location-info class elements
    const extractedLocData = [
        locationData.ip,
        `${locationData.location.city}, ${locationData.location.region} ${locationData.location.postalCode}`,
        `UTC ${locationData.location.timezone}`,
        locationData.isp,
    ];
    const locationElements = document.querySelectorAll(".location-info");
    locationElements.forEach((ele, index) => {
        ele.innerText = extractedLocData[index];
    });
};

/**
 * Send an api request using the ip address to retrieve the location data. If no ip address is supplied, the api will return
 * the users location data
 */
const getLocationData = async (query) => {
    let endPoint =
        "https://geo.ipify.org/api/v2/country,city?apiKey=at_hD34dauJUbmmiG8fP7aMw4HN0b4XQ&";
    if (query && checkIfIP(query)) {
        endPoint += `ipAddress=${query}`;
    } else if (query && isDomain(query)) {
        endPoint += `domain=${query}`;
    } else if (query) {
        displayPopUpMsg(
            "This input is not a valid IP or domain. Your current IP address will be used instead"
        );
    }
    const response = await fetch(new URL(endPoint));
    if (response.status != 200) {
        displayPopUpMsg(
            "There was a problem connecting to the API, please try again later"
        );
        return null;
    }
    const data = await response.json();
    return data;
};

const displayPopUpMsg = (message) => {
    document.querySelector(".popup-container").style.display = "flex";
    document.querySelector(".popup-text").innerText = message;
};
/**
 * Check if input is an ip address.
 */
const checkIfIP = (input) => {
    return input.match(
        /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/
    );
};

/**
 * Check if input is a domain.
 */
const isDomain = (input) => {
    return input.match(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/);
};
init();
