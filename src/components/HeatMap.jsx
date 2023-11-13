import React, { useEffect, useRef } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import styled from "styled-components";
import { Spinner } from 'react-bootstrap';

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

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 400; // Ensure it's above the map layers
`;


function HeatMap({ data, isLoading }) {
  const position = [-22.9068, -43.1729];

  const HeatLayer = ({ data }) => {
    const map = useMap();
    const heatLayerRef = useRef(null);

    useEffect(() => {
      if (data && data.features && Array.isArray(data.features)) {
        const intensities = data.features.map(f => f.properties.intensity);
        const minIntensity = Math.min(...intensities);
        const maxIntensity = Math.max(...intensities);

        const scaledHeatPoints = data.features.map(feature => [
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
          (feature.properties.intensity - minIntensity) / (maxIntensity - minIntensity)
        ]);
        console.log(scaledHeatPoints)

        // Cria e adiciona a nova camada de calor
        heatLayerRef.current = L.heatLayer(scaledHeatPoints).addTo(map);
      }

      // Função de limpeza
      return () => {
        if (heatLayerRef.current && map.hasLayer(heatLayerRef.current)) {
          map.removeLayer(heatLayerRef.current);
        }
      };
    }, [data, map]);

    return null;
  };

  return (
    <MapWrapper>
      <MapContainer center={position} zoom={8} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatLayer data={data} />
        {isLoading && (
          <SpinnerWrapper>
            <Spinner animation="border" variant="primary">
            </Spinner>
          </SpinnerWrapper>
        )}
      </MapContainer>
    </MapWrapper>
  );
}


export default HeatMap;

