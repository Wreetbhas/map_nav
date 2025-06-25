var watchId;
var locationTrackLayers;
var circleMarker;
var isUserInteracting = false;
var interactionTimeout;
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

        // Set up interaction listeners
        setupMapInteractionListeners();

        watchId = navigator.geolocation.watchPosition(showPosition, showError, options);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
}

function setupMapInteractionListeners() {
    // Listen for various user interaction events
    map.on('dragstart', onUserInteractionStart);
    map.on('zoomstart', onUserInteractionStart);
    map.on('movestart', onUserInteractionStart);

    // Listen for interaction end events
    map.on('dragend', onUserInteractionEnd);
    map.on('zoomend', onUserInteractionEnd);
    map.on('moveend', onUserInteractionEnd);

    // Also listen for touch events on mobile
    map.on('touchstart', onUserInteractionStart);
    map.on('touchend', onUserInteractionEnd);
}

function onUserInteractionStart() {
    isUserInteracting = true;
    // Clear any existing timeout
    if (interactionTimeout) {
        clearTimeout(interactionTimeout);
    }
}

function onUserInteractionEnd() {
    // Use a timeout to ensure all interaction events have finished
    // This prevents rapid fire of interaction events from interfering
    if (interactionTimeout) {
        clearTimeout(interactionTimeout);
    }

    interactionTimeout = setTimeout(() => {
        isUserInteracting = false;
        var latlng = marker.getLatLng();
        map.flyTo([latlng.lat, latlng.lng], 18, {
            animate: true,
            duration: 1 // duration in seconds
        });
    }, 5000); // Wait 1 second after last interaction before allowing auto-pan
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    accuracy = position.coords.accuracy;

    // Update the marker regardless of interaction state
    if (circleMarker) {
        locationTrackLayers.removeLayer(circleMarker);
    }
    circleMarker = L.circle([lat, lon], 3, circleMarkerOptions);
    locationTrackLayers.addLayer(circleMarker);

    // Only pan the map if user is not currently interacting
    if (!isUserInteracting) {
        map.panTo(new L.LatLng(lat, lon));
        //map.setView(new L.LatLng(lat,lon), 18);
    }
}

function showError(error) {
    alert(error.message);
}
