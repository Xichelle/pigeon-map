import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer,CircleMarker, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import './App.css';  // Import your custom CSS file for clipping

import pigeonImage from './pigeon.png';

const foreignBornData = [
  { location: "New York City", coordinates: [40.7128, -74.006], foreignBornPercent: 36.37 },
  { location: "Manhattan", coordinates: [40.7831, -73.9712], foreignBornPercent: 28.09 },
  { location: "Battery Park/Tribeca", coordinates: [40.7033, -74.017], foreignBornPercent: 22.70 },
  { location: "Greenwich Village", coordinates: [40.7336, -74.0027], foreignBornPercent: 22.70 },
  { location: "Lower East Side", coordinates: [40.715, -73.9843], foreignBornPercent: 30.30 },
  { location: "Queens", coordinates: [40.7447, -73.9485],foreignBornPercent: 46.76 },
  { location: "Jackson Heights", coordinates: [40.7557, -73.8831],foreignBornPercent: 59.17 },
  { location: "Elmhurst", coordinates: [40.74, -73.88],foreignBornPercent: 63.77 },
  { location: "Flushing", coordinates: [ 40.7658, -73.8331],foreignBornPercent: 56.73 },
  { location: "Bensonhurst", coordinates: [ 40.6033, -74.0020],foreignBornPercent: 55.07 },
  { location: "East Flatbush", coordinates: [40.65371, -73.93042],foreignBornPercent: 50.58 },
  { location: "Jamaica/St. Albans", coordinates: [40.699783, -73.786026],foreignBornPercent: 45.3 }

  // You can add more locations here based on your dataset
];

const getColor = (percent) => {
  if (percent > 50) return "red";
  if (percent > 30) return "orange";
  if (percent > 20) return "yellow";
  return "green";
};

const pigeonIcon = new L.Icon({
  iconUrl: pigeonImage,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});


function App() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    axios
      .get('https://data.ny.gov/resource/w8wg-vp5f.json')
      .then((response) => {
        const validData = response.data
          .filter(item => item.latitude && item.longitude)
          .map((item) => ({
            borough: item.borough,
            street1: item.intersection_street_1,
            street2: item.intersection_street_2,
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
            addressType: item.address_type || "Unknown",
          }));
        setLocations(validData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const position = [40.7447, -73.9485]; // Centering on Queens

  return (
    <div className="App">
      <h1>Human are pigeons without Feathers</h1>
      <p>As a species that has never belonged to this city, 
        I can see pigeons and people from all over the world gathering at the subway station 
        every morning to start a new migration. 
        Queensboro Plaza Station was the starting point for our migration. 
        Pigeons depend on people for their lives, and people are as busy as pigeons for their survival. 
        We look for ways to adapt here, to survive in crowded and complex cities, 
        and survival in the same cities has left us similar traces.
      </p>
      {loading ? (
        <p>Loading map...</p>
      ) : (
        <div className="pigeon-map-container">
          <MapComponent center={position} zoom={12} data={locations} />
        </div>
      )}
      <p>Concrete is also a jungle<br></br>
      We left our familiar surroundings and took refuge <br></br>
      in man-made steel and barren street greenery, <br></br>
      seeking shelter between construction sites and scaffolding.
      </p><br></br>
      <p>Deviate from the nature of social animals<br></br>
      There are always small groups of pigeons standing <br></br>
      on the wall outside the station, <br></br>
      and they are used to parting.<br></br> 
      In each takeoff and landing, <br></br>
      they may not be the same pigeons <br></br>
      that were around last time. <br></br>
      I have never seen a flock of pigeons <br></br>
      in Queens, mostly in three or two, <br></br>
      or alone. <br></br>
      Unlike the flock of pigeons in Manhattan, <br></br>
      they seem to have learned to <br></br>deviate from their <br></br>
      social <br></br>
      instincts <br></br>
      as they adapted <br></br>
      to the world.
      </p><br></br><br></br>
      <p>
      I saw two boys, one following me to the car, <br></br>
      the other smiling and waving outside the window, <br></br>
      both of them reaching out to each other through the glass <br></br>and gently putting their hands together against the glass, <br></br>
      the sound of their palms touching the glass was like a young heartbeat. <br></br>
      I don't know if they will see each other again, if they have arranged another meeting
      </p>
      <p>
      I looked at a man with an Asian face, 
      leaning against the door and staring out the window at the street scene running backwards. 
      He looked up. I looked back and almost caught his eye. 
      I saw him raise his hand and wipe his cheek. The sun showed the tears on his face.
      </p>
      <br></br><br></br>
      <p>Be alert and defensive<br></br>
      Pigeons are used to feeding and surviving on stations and roadsides in close proximity to humans and danger. 
      They are not losing their guard. 
      They will not hesitate to move away from humans when they approach. 
      They still don't trust humans, but that doesn't stop them from relying on them for survival.
      </p><br></br><br></br>
      <p>
      Perhaps surrounded by too many unfamiliar things, 
      numbness and indifference have become the common language of outsiders. 
      Like losing the sense of kindness to the outside world, 
      we used to avoid the approach of the outside world with silence. 
      You rarely hear pigeons in the city, do you. 
      In the long test of survival, silence has become our most effective way of hiding. 
      This is the most basic survival strategy of living things, to become part of the environment to survive.
      </p>
    </div>
  );
}

const MapComponent = ({ center, zoom, data }) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '200vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {data.map((location, idx) => (
        <Marker
          key={idx}
          position={[location.latitude, location.longitude]}
          icon={pigeonIcon}
        >
          <Popup>
            <PopupComponent location={location} />
          </Popup>
        </Marker>
      ))}

{foreignBornData.map((locationData, idx) => (
              <CircleMarker
                key={idx}
                center={locationData.coordinates}
                radius={40}   // Adjust the size of the circle
                fillColor={getColor(locationData.foreignBornPercent)}
                color={getColor(locationData.foreignBornPercent)}
                fillOpacity={0.7}
                stroke={true}
              >
                <Popup>
                  <strong>{locationData.location}</strong><br />
                  Foreign-Born Population: {locationData.foreignBornPercent}%
                </Popup>
              </CircleMarker>
            ))}

    </MapContainer>
  );
};

const PopupComponent = ({ location }) => {
  return (
    <div>
      <h2>{location.borough}</h2>
      <h6>
        <strong>Intersection:</strong> {location.street1} & {location.street2}
      </h6>
      <h6>
      <strong>Address Type:</strong> {location.addressType}
      </h6>
    </div>
  );
};

export default App;
