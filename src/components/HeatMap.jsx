import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import styled from "styled-components";

const MapWrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  padding: 20px;
  min-height: 200px;

  .leaflet-container {
    height: 100%;
  }

  @media (max-height: 600px) {
    min-height: 300px;
  }
`;

function HeatMap() {
  const position = [-22.9068, -43.1729];

  return (
    <MapWrapper>
      <MapContainer center={position} zoom={8} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            Um popup exemplo. <br /> Facilmente customizável.
          </Popup>
        </Marker>
      </MapContainer>
    </MapWrapper>
  );
}


export default HeatMap;