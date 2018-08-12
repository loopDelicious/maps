import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import Airtable from 'airtable'
// import moment from 'moment'
import secrets from '../secrets'
// import geojson from '../data.json'
// import meetups from '../meetups.json'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../css/map.css'

mapboxgl.accessToken = secrets.mapboxKey;

class Map extends React.Component {

    //todo: toggle chloropleth with tooltips view using redux example
    // https://bl.ocks.org/hrecht/82b6440ed3b982a6f594
    // todo: load data dynamically

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
            "icon-image": "postman",
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
        // geojson.features.forEach(function(marker) { // to plot feet on the street from local data file
        // meetups.features.forEach(function(marker) {  // to plot meetups from local data file
            // fetch(`https://api.meetup.com/2/open_events?key=${secrets.meetupKey}&text=postman&category=34`)
            // fetch(`https://api.meetup.com/find/upcoming_events?key=${secrets.meetupKey}&text=postman&topic_category=34&start_date_range=${moment().format('YYYY-MM-DDTHH:MM:SS')}&radius=global`, {
            //     mode: 'no-cors'
            // }).then((response) => {
            //     return response.json();
            // })
            //     .then((myJson) => {
            //         myJson.results.forEach(function(marker) {
            //             let el = document.createElement('div');
            //             el.className = 'marker';
            //
            //             new mapboxgl.Marker(el)
            //                 .setLngLat([marker.venue.lon, marker.venue.lat])
            //                 .setPopup(new mapboxgl.Popup({ offset: 10 }) // add popups
        //                     .setHTML('<h3>' + marker.group.name + '</h3><p>' + marker.name + '</p>'))
            //                 .addTo(map);
            //         })
            //     })

            // to plot meetups from airtable base

            let base = new Airtable({
                apiKey: secrets.airtableKey
            }).base(secrets.airtableApp);

            base('Meetups').select({
                // Selecting the first 3 records in Grid view:
                maxRecords: 100,
                view: "Grid view"
            }).eachPage(function page(records, fetchNextPage) {
                // This function (`page`) will get called for each page of records.

                records.forEach(function(marker) {
                    console.log('Retrieved', marker.get('id'));
                    let el = document.createElement('div');
                    el.className = 'marker';

                    new mapboxgl.Marker(el)
                        .setLngLat([marker.fields.lon, marker.fields.lat])
                        .setPopup(new mapboxgl.Popup({ offset: 10 }) // add popups
                            .setHTML('<h3>' + marker.fields.group + '</h3><a href=' + marker.fields.link + ' target="_blank"><p>' + marker.fields.title + '</p>'))
                        .addTo(map);
                });

                // To fetch the next page of records, call `fetchNextPage`.
                // If there are more records, `page` will get called again.
                // If there are no more records, `done` will get called.
                fetchNextPage();

            }, function done(err) {
                if (err) { console.error(err); return; }
            });

            // fetch(`https://api.airtable.com/v0/${secrets.airtableApp}/Table%201?maxRecords=3&view=Grid%20view`, {
            //     method: "GET",
            //     headers: {
            //         "Authorization": `Bearer ${secrets.airtableKey}`
            //     },
            //     mode: 'cors',
            //     credentials: 'same-origin'
            // }).then((response) => {
            //     console.log(response);
            //     return response.json();
            // }).then((myJson) => {
            //     myJson.forEach(function(marker) {
            //         let el = document.createElement('div');
            //         el.className = 'marker';
            //
            //         new mapboxgl.Marker(el)
            //         .setLngLat([marker.lon, marker.lat])
            //         .setPopup(new mapboxgl.Popup({ offset: 10 }) // add popups
            //         .setHTML('<h3>' + marker.group + '</h3><p>' + marker.name + '</p>'))
            //         .addTo(map);
            // })
        // })
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
            // zoom: 12, // to plot feet on the street
            zoom: 1, // to plot meetups
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
