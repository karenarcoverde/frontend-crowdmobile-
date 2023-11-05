import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
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

  const HeatLayer = () => {
    const map = useMap();

    const geojsonData = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "intensity": 0.5
          },
          "geometry": {
            "type": "Point",
            "coordinates": [-43.1729, -22.9068]
          }
        },
      ]
    };

    const heatPoints = geojsonData.features.map(feature => [
      feature.geometry.coordinates[1],
      feature.geometry.coordinates[0],
      feature.properties.intensity
    ]);

    L.heatLayer(heatPoints).addTo(map);

    return null;
  };

  return (
    <MapWrapper>
      <MapContainer center={position} zoom={8} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <HeatLayer />
      </MapContainer>
    </MapWrapper>
  );
}

export default HeatMap;
