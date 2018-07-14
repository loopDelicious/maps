import React from 'react'
import mapboxgl from 'mapbox-gl'
import secrets from '../secrets'

mapboxgl.accessToken = secrets.mapboxKey;

class Map extends React.Component {

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [5, 34],
            zoom: 1.5
        });

        this.map.on('load', () => {
            this.map.addSource('countries', {
                type: 'geojson',
                data: this.props.data
            });

            this.map.addLayer({
                id: 'countries',
                type: 'fill',
                source: 'countries'
            }, 'country-label-lg');

        });
    }

    render() {
        return (
            <div ref={el => this.mapContainer = el} />
        );
    }
}

export default Map;
