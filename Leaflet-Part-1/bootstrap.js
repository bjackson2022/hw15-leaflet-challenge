// Initialize the map
var map = L.map('map').setView([37.0902, -95.7129], 4);

// Add the tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18
}).addTo(map);

// Load the earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);

        // Define a function to get the marker color based on depth
        function getMarkerColor(depth) {
            return depth > 90 ? '#0000CD' :
                   depth > 70 ? '#00FFFF' :
                   depth > 50 ? '#ADFF2F' :
                   depth > 30 ? '#FFD700' :
                   depth > 10 ? '#FF4500' :
                                '#8B0000';
        }

        // Define a function to get the marker size based on magnitude
        function getMarkerSize(magnitude) {
            return magnitude * 5;
        }

        // Add markers and popups
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getMarkerSize(feature.properties.mag),
                    fillColor: getMarkerColor(feature.geometry.coordinates[2]),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindPopup(`<b>${feature.properties.place}</b><br>${new Date(feature.properties.time).toLocaleString()}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`);
            }
        }).addTo(map);

        // Create legend
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'legend');
            var labels = ['<strong>Depth</strong>'];
            var colors = ['#8B0000', '#FF4500', '#FFD700', '#ADFF2F', '#00FFFF', '#0000CD'];
            var depths = ['-10 to 10 km', '10 to 30 km', '30 to 50 km', '50 to 70 km', '70 to 90 km', '>90 km'];
            for (var i = 0; i < colors.length; i++) {
                div.innerHTML += '<i class="circle" style="background:' + colors[i] + '"></i> ' + depths[i] + '<br>';
            }
            div.innerHTML = labels.join('<br>') + div.innerHTML;
            return div;
        };

        legend.addTo(map);

    });
