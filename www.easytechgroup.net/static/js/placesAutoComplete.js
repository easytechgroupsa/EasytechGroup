// Google Places Autocomplete
// https://developers.google.com/maps/documentation/javascript/places-autocomplete

// This is primarily designed for radius search when using Azure Search

// This is called by the include script ?callback=initAutoComplete parameter
let autocomplete;

let jobForm = document.getElementById("job-filter");

if (jobForm == null) {
    jobForm = document.getElementById("job-search");
}

const locLat = document.getElementById("loc-lat"); // the hidden fields that hold the values
const locLng = document.getElementById("loc-lng")
const locInput = document.getElementById("js-location"); // the auto-complete input
const locCountryName = document.getElementById("loc-cname");
const locCountryCode = document.getElementById("loc-ccode");

const getUserLocation = document.getElementById("js-getUserLocation"); // geolocation button

if (getUserLocation) {
    getUserLocation.addEventListener("click", function (e) { // tracks button click to use browser geolocation
        e.preventDefault();
        getUserGeoLocation();
    });
}

// Entry point after Places library loaded
function initAutoComplete() {

    if (!locInput) {
        return;
    }

    const options = {
        fields: ["geometry.location", "name", "address_components", "type"],
        strictBounds: false
    };

    autocomplete = new google.maps.places.Autocomplete(locInput, options);

    // you can restrict to regions if required

    //autocomplete.setComponentRestrictions({
    //    country: ["us"]
    //});

    autocomplete.addListener("place_changed", getSelectedPlace);

    locInput.addEventListener("change", (event) => {

        if (!locInput.value) {

            locInput.value = null;
            locCountryName.value = null;
            locCountryCode.value = null;
            locLat.value = null;
            locLng.value = null;
            jobForm.submit();
        }
    });
}

// Prevents issue with users hitting enter on the location input
if (locInput) {
    locInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            getSelectedPlace();
        }
    });
}

// Callback to get the place details from the autocomplete object.
function getSelectedPlace() {
    const place = autocomplete.getPlace();

    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();

    if (place.address_components) {

        const countryEntry = place.address_components.find(item => item.types.includes("country"));

        if (countryEntry) {
            locCountryCode.value = countryEntry.short_name;
            locCountryName.value = countryEntry.long_name;

            if (place.address_components.length === 1) {
                lat = null;
                lng = null;
            }
        }

    }

    if (lat) {
        setUserLocation(lat, lng, place.name, false);
    } else {
        blankLatLng();
    }
    jobForm.submit();
}

// Uses browser Geolocation to get current user location
function getUserGeoLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    } else {
        console.warn("Browser doesn't support geo-location");
    }
}

// Blanks the location lat/lng fields
function blankLatLng() {
    locLat.value = null;
    locLng.value = null;
}

// Sets the location
function setUserLocation(lat, lng, name, setname) {

    lat = parseFloat(lat);
    lng = parseFloat(lng);

    if (!lat || (lat < -90 || lat > 90)) {
        lat = 39.828175;
    }

    if (!lng || (lng < -180 || lng > 180)) {
        lng = -98.5795;
    }

    if (setname) {
        if (!name || name.length == 0) {
            name = "Current location";
        }
    }

    const userLocation = {
        "name": name,
        "lat": lat,
        "lng": lng
    }

    if (locLat && locLng) {
        locLat.value = userLocation.lat;
        locLng.value = userLocation.lng;
        if (setname) {
            locInput.value = userLocation.name;
        }
    }

    return userLocation;
}

// When browser geolocation succesfully called
// We get the lat/lng and then reverse geocode it to get the location name to display
// See https://developers.google.com/maps/documentation/javascript/geocoding
function geolocationSuccess(position) {
    if (position) {
        const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        reverseGeocode(latlng);
    }
}

// Reverse geocodes a lat/lng to get the location name
function reverseGeocode(latlng) {

    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status == 'OK') {

            const result = results[0];
            let name = "";

            if (result.address_components[2]) {
                name = result.address_components[2].short_name ? result.address_components[2].short_name : result.address_components[2].long_name;
            }

            if (result.address_components[3]) {
                name += ", ";
                name += result.address_components[3].short_name ? result.address_components[3].short_name : result.address_components[3].long_name;
            }

            setUserLocation(latlng.lat().toFixed(5), latlng.lng().toFixed(5), name, true);
            jobForm.submit();

        } else {
            console.log('Reverse Geocode was not successful for the following reason: ' + status);
        }
    });
}

// When browser geolocation failed
function geolocationError() {

    console.error("Unable to get user location...");

    const warningAlert = document.getElementById("js-geolocation-warning"); // div with warning message alert

    if (warningAlert) {
        warningAlert.classList.remove("d-none");
    };
}

