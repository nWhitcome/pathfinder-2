var mylocation = "";
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoid2hpdGNvbWUiLCJhIjoiY2psb2pvZjA5MXU4ZDNwbzVwbWs1cDN0NSJ9.HibnWo-USb42esTveXfZgA'
}).addTo(mymap);

function locate() {
    mymap.locate({setView: true, maxZoom: 16});
}

function onLocationFound(e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(mymap);
    mylocation = e.latlng;
    //.bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(mymap);
}

mymap.on('locationfound', onLocationFound);

locate();

var trees = "";
let latMi = 1/69.172;
let earthCirc = 24901.461;

$(document).ready(function(){
    $("button").click(function(){
        var inputMiles = document.getElementById("milesInput").value;
        console.log("Getting...")

        var lngCng = 1/((earthCirc/360) * Math.cos(mylocation.lat * Math.PI/180));

        var northLimit = (mylocation.lat + (latMi * inputMiles));
        var southLimit = (mylocation.lat - (latMi * inputMiles));
        var eastLimit = (mylocation.lng + (inputMiles * lngCng));
        var westLimit = (mylocation.lng - (inputMiles * lngCng));

        var boundBox = 's="'+ southLimit + '" w="' + westLimit + '" n="' + northLimit + '" e="' + eastLimit + '"';

        var sendScript = 'https://overpass-api.de/api/interpreter?data=<osm-script output="json" timeout="25"><union><query type="node"><has-kv k="highway"/><has-kv k="highway" modv="not" v="elevator"/><has-kv k="service" modv="not" v="parking_aisle"/><has-kv k="highway" modv="not" v="motorway"/><has-kv k="highway" modv="not" v="motorway_link"/><has-kv k="highway" modv="not" v="bus_stop"/><bbox-query ' + boundBox + '/></query><query type="way"><has-kv k="highway"/><has-kv k="highway" modv="not" v="elevator"/><has-kv k="service" modv="not" v="parking_aisle"/><has-kv k="highway" modv="not" v="motorway"/><has-kv k="highway" modv="not" v="motorway_link"/><has-kv k="access" modv="not" v="private"/><bbox-query ' + boundBox + '/></query><query type="relation"><has-kv k="highway"/><has-kv k="highway" modv="not" v="elevator"/><has-kv k="service" modv="not" v="parking_aisle"/><has-kv k="highway" modv="not" v="motorway"/><has-kv k="highway" modv="not" v="motorway_link"/><bbox-query ' + boundBox + '/></query></union><print mode="body"/><recurse type="down"/><print mode="skeleton" order="quadtile"/></osm-script>'

        $.getJSON(sendScript)
        .done(function(data){
            buildTree(data.elements.filter(function (entry) { return entry.type === 'way' }), data.elements.filter(function (entry) { return entry.type === 'node' }));
        });
    });
});

function buildTree(paths, nodes){
    var thisTree = [];

    //Find the node closest to the current location
    var closestNode = nodes[0];
    for(n in nodes){
        if(calcCrow(mylocation.lat, mylocation.lng, nodes[n].lat, nodes[n].lon) < calcCrow(mylocation.lat, mylocation.lng, closestNode.lat, closestNode.lon)){
            closestNode = nodes[n];
        }
    }

    for(p in paths){
      for(node in paths[p].nodes){
        if(thisTree.some(tree => tree.id === node.id)){

      }
    }
}
}

function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 3959;
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function toRad(Value) {
    return Value * Math.PI / 180;
}