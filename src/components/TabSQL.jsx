import React, { useState } from 'react';
import { FormControl, Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { InfoCircle } from 'react-bootstrap-icons';
import axios from 'axios';


const SqlEditorContainer = styled.div`
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SqlInputWrapper = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 5px;
`;

const StyledFormControl = styled(FormControl)`
  width: 100%;
  font-family: monospace;
  min-height: 200px;
  max-height: 200px;
  overflow-y: auto;
`;

const ActionWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const InfoIconWrapper = styled.div`
  position: absolute;
  display: flex;
  right: 0;
  cursor: pointer;
`;

const SectionTitle = styled.h5`
  color: #333333;
`;

const JsonOutput = styled.pre`
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  font-size: 0.9em;
  line-height: 1.6;
`;

function TabSQL({ baseURL, onQueryResult, setIsLoading }) {
    const [sqlQuery, setSqlQuery] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e) => {
        setSqlQuery(e.target.value);
    };

    const handleQuerySubmit = () => {
        setIsLoading(true);
        
        const data = {
            query: sqlQuery,
        };
        
        axios.post(`${baseURL}/execute_sql`, data)
             .then(response => {
                onQueryResult(response.data);
                setIsLoading(false);
             })
             .catch(error => {
                console.error('Error posting data:', error);
                setIsLoading(false);
             });
    };

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const jsonData = {
        "features": [
            {
                "geometry": {
                    "coordinates": ["<longitud>", "<latitud>"],
                    "type": "Point"
                },
                "properties": {
                    "intensity": "<number>"
                },
                "type": "Feature"
            }
        ]
    }
    const jsonString = JSON.stringify(jsonData, null, 2)

    return (
        <SqlEditorContainer>
            <SqlInputWrapper>
                <StyledFormControl
                    as="textarea"
                    rows={10}
                    placeholder={"SELECT client_latitude, client_longitude, latency FROM android_extracts_all"}
                    value={sqlQuery}
                    onChange={handleInputChange}
                />
                <InfoIconWrapper>
                    <InfoCircle size={20} onClick={handleShowModal} />
                </InfoIconWrapper>
            </SqlInputWrapper>

            <ActionWrapper>
                <Button variant="primary" onClick={handleQuerySubmit}>
                    Run Query
                </Button>
            </ActionWrapper>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>How to use SQL Tab</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SectionTitle>Input:</SectionTitle>
                    <ul>
                        <li>Three columns: two columns must have longitud and latitud and the third must be the intensity</li>
                        <li>Two columns: two columns must have longitud and latitud, the intensity will be user density</li>
                    </ul>
                    <SectionTitle>Output:</SectionTitle>
                    <JsonOutput>{jsonString}</JsonOutput>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </SqlEditorContainer>
    );
}

export default TabSQL;
