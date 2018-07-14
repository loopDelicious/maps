import React from 'react'
import mapboxgl from 'mapbox-gl'
import secrets from '../secrets'
import '../css/map.css'

mapboxgl.accessToken = secrets.mapboxKey;

class Map extends React.Component {

    componentDidMount() {
        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v9',
            center: [-96, 37.8],
            zoom: 3
        });

        let geojson = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-77.032, 38.913]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'Washington, D.C.'
                }
            },
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [-122.414, 37.776]
                    },
                    properties: {
                        title: 'Mapbox',
                        description: 'San Francisco, California'
                    }
                }]
        };

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
