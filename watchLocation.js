var watchId;
var locationTrackLayers;
var circleMarker;


var circleMarkerOptions = {
    color: '#0008ff',
    fillColor: '#0008ff',
    fillOpacity: 10
}


function watchLocation() {
    const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 30000
    };

    if (navigator.geolocation) {
        locationTrackLayers = L.layerGroup([]);
        locationTrackLayers.addTo(map);
        watchId = navigator.geolocation.watchPosition(showPosition, showError, options);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }

}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    accuracy = position.coords.accuracy;

    if (circleMarker) {
        locationTrackLayers.removeLayer(circleMarker);
    }

    circleMarker = L.circle([lat, lon], 5, circleMarkerOptions);
    locationTrackLayers.addLayer(circleMarker);

    map.panTo(new L.LatLng(lat, lon));
}

function showError(error) {
    alert(error.message);
}
