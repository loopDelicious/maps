import React from 'react'
import mapboxgl from 'mapbox-gl'
import secrets from '../secrets'
import geojson from '../data.json'
import '../css/map.css'

mapboxgl.accessToken = secrets.mapboxKey;

class Map extends React.Component {

    //todo: toggle chloropleth with tooltips view using redux example

    componentDidMount() {
        let map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/light-v9',
            center: [-122.4194155, 37.7749295],
            zoom: 12
        });

        geojson.features.forEach(function(marker) {

            // create a HTML element for each feature
            let el = document.createElement('div');
            el.className = 'marker';

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 10 }) // add popups
                .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
                .addTo(map);

        });
    }

    render() {
        return (
            <div ref={el => this.mapContainer = el} />
        );
    }
}

export default Map;
