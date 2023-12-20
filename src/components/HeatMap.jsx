import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import styled from 'styled-components';
import { Spinner, Button } from 'react-bootstrap';
import domtoimage from 'dom-to-image';

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
  z-index: 400; 
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 500;
`;

const CustomButton = ({ onClick }) => (
  <ButtonWrapper onClick={onClick} style={{ cursor: 'pointer' }}>
    <Button variant="primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
      </svg>
    </Button>
  </ButtonWrapper>
);

function HeatMap({ data, isLoading }) {
  const position = [-22.9068, -43.1729];
  const [showDownloadButton, setShowDownloadButton] = useState(true);

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

        // Create and add the new heat layer
        heatLayerRef.current = L.heatLayer(scaledHeatPoints, {
          minOpacity: 0.5, zIndex: 4, maxZoom: 18, radius: 20
        }).addTo(map);
      }

      // Cleanup function
      return () => {
        if (heatLayerRef.current && map.hasLayer(heatLayerRef.current)) {
          map.removeLayer(heatLayerRef.current);
        }
      };
    }, [data, map]);

    return null;
  };

  const DownloadButton = () => {
    const map = useMap();

    const downloadMap = () => {
      if (map) {
        setShowDownloadButton(false);
        const container = map.getContainer();
        domtoimage.toJpeg(container, {
          quality: 0.95,
          width: container.offsetWidth,
          height: container.offsetHeight
        })
          .then(function (dataUrl) {
            const link = document.createElement('a');
            link.download = 'heatmap.jpeg';
            link.href = dataUrl;
            link.click();
          })
          .catch(function (error) {
            console.error('Erro ao baixar o mapa', error);
          })
          .finally(() => {
            setShowDownloadButton(true);
          });
      }
    };

    return (
      <React.Fragment>
        {showDownloadButton && (
          <CustomButton onClick={downloadMap} />
        )}
      </React.Fragment>
    );
  };

  return (
    <MapWrapper>
      <MapContainer center={position} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatLayer data={data} />
        {isLoading && (
          <SpinnerWrapper>
            <Spinner animation="border" variant="primary" />
          </SpinnerWrapper>
        )}
        {showDownloadButton && (
          <DownloadButton />
        )}
      </MapContainer>
    </MapWrapper>
  );
}

export default HeatMap;