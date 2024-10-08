// define url for getting json for all earthquakes in the past 7 days
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// create map
let myMap = L.map("map").setView([39.8283, -98.5795], 5);

// this section for creating the legend was written with assistance from the Xpert Learning AI
// Create a color scale function
function getColor(value) {
    return value > 80 ? '#800026' :
           value > 60 ? '#BD0026' :
           value > 40 ? '#E31A1C' :
           value > 20 ? '#FC4E2A' :
           value > 0  ? '#FD8D3C' :
                        '#FFEDA0';
}

// Set up the legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
        grades = [0, 20, 40, 60, 80, 100],
        labels = [];

    // Add custom styles to the legend
    div.style.backgroundColor = "white";
    div.style.padding = "10px";
    div.style.borderRadius = "5px";
    div.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

    // Loop through the grades and generate a label with a colored square for each
    for (let i = 0; i < grades.length; i++) {
        labels.push(
            '<i style="background:' + getColor(grades[i] + 1) + '; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
        );
    }

    div.innerHTML = labels.join("");
    return div;
};

// Adding the legend to the map
legend.addTo(myMap);

// add tile layer to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json(url).then(function (data) {
    // extract features from returned json
    let earthquakes = data["features"];

    // iterate over every earthquake
    for (let i = 0; i < earthquakes.length; i++) {
        let earthquake = earthquakes[i];

        // create map marker for earthquake
        let marker = L.circle([earthquake["geometry"]["coordinates"][1], earthquake["geometry"]["coordinates"][0]], {
            color: "black",
            fillColor: getColor(earthquake["geometry"]["coordinates"][2]),
            fillOpacity: 1,
            radius: earthquake["properties"]["mag"] * 10000,
            weight: 1 // written with help from XPert Learning AI
        });

        // add popup to marker
        marker.bindPopup(`<p>Magnitude: ${earthquake["properties"]["mag"]}</p><p>Location: ${earthquake["properties"]["place"]}</p><p>Depth: ${earthquake["geometry"]["coordinates"][2]}</p>`);

        // add marker to map
        marker.addTo(myMap);
    }
    console.log("done");
});
