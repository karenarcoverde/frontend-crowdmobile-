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
    <Button variant="light btn-sm">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-image" viewBox="0 0 16 16">
        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
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
    
        container.classList.add('hide-map-controls');
    
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
            container.classList.remove('hide-map-controls');
          })
          .catch(function (error) {
            console.error('Erro ao baixar o mapa', error);
            container.classList.remove('hide-map-controls');
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
      <MapContainer center={position} zoom={8} style={{ height: '102%', width: '100%' }}>
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
