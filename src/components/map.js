import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import secrets from '../secrets'
import geojson from '../data.json'
import '../css/map.css'

mapboxgl.accessToken = secrets.mapboxKey;

class Map extends React.Component {

    //todo: toggle chloropleth with tooltips view using redux example

    office = {
        "id": "points",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-122.4007997, 37.7892151]
                    }
                }]
            }
        },
        "layout": {
            "icon-image": "cat",
            "icon-size": 0.25
        }
    };

    addGeocoder = (map) => {
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            country: 'us', // limit results to US
        });
        geocoder.className = 'geocoder';

        document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

    };

    // updateGeocoderProximity = (map) => {
    //     // proximity is designed for local scale, if the user is looking at the whole world,
    //     // it doesn't make sense to factor in the arbitrary centre of the map
    //     if (map.getZoom() > 9) {
    //         let center = map.getCenter().wrap(); // ensures the longitude falls within -180 to 180 as the Geocoding API doesn't accept values outside this range
    //         geocoder.setProximity({ longitude: center.lng, latitude: center.lat });
    //     } else {
    //         geocoder.setProximity(null);
    //     }
    // };

    addMarkers = (map) => {
        geojson.features.forEach(function(marker) {

            let el = document.createElement('div');
            el.className = 'marker';

            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 10 }) // add popups
                    .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
                .addTo(map);

        });
    };

    addHomeOffice = (map) => {
        let home = document.createElement('div');
        home.className = 'marker home';
        new mapboxgl.Marker(home)
            .setLngLat(this.office.source.data.features[0].geometry.coordinates)
            .addTo(map);
    };

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/light-v9',
            center: [-122.4194155, 37.7749295],
            zoom: 12,
            pitch: 0
        });

        this.addGeocoder(map);
        // map.on('moveend', this.updateGeocoderProximity(map));
        map.on('load', function() {
            // this.updateGeocoderProximity(map);

        });
        this.addHomeOffice(map);
        this.addMarkers(map);

    }

    render() {
        return (

            <div>
                <div ref={el => this.mapContainer = el} />
            </div>

        );
    }
}

export default Map;
