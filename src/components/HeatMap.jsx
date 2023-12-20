import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
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
    <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 7L12 14M12 14L15 11M12 14L9 11" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 17H12H8" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="#1C274C" strokeWidth="1.5"/>
    </svg>
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