import React from 'react'
import ReactDOM from 'react-dom'
import Map from './components/map'

class Application extends React.Component {
    render() {
        return (

            <div>
                <Map />

            </div>

        );
    }
}

ReactDOM.render(<Application />, document.getElementById('map'));
