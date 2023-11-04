import React, { useState } from 'react';
import { FormControl, Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { InfoCircle } from 'react-bootstrap-icons';

const SqlEditorContainer = styled.div`
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SqlInputWrapper = styled.div`
  width: 100%; 
  position: relative;
`;

const StyledFormControl = styled(FormControl)`
  width: 100%;
  font-family: monospace;
`;

const RunButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const InfoIconWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

function TabSQL() {
    const [sqlQuery, setSqlQuery] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e) => {
        setSqlQuery(e.target.value);
    };

    const handleQuerySubmit = () => {
        console.log(sqlQuery);
    };

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    return (
        <SqlEditorContainer>
            <SqlInputWrapper>
                <StyledFormControl
                    as="textarea"
                    rows={10}
                    placeholder={"SELECT \"CLIENT_LATITUDE\", \"CLIENT_LONGITUDE\", \"LATENCY\" FROM android_extracts_all"}
                    value={sqlQuery}
                    onChange={handleInputChange}
                />
                <InfoIconWrapper>
                    <InfoCircle size={20} onClick={handleShowModal} />
                </InfoIconWrapper>
            </SqlInputWrapper>

            <RunButtonWrapper>
                <Button variant="primary" onClick={handleQuerySubmit}>
                    Run Query
                </Button>
            </RunButtonWrapper>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>How to use SQL Tab</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Some interesting info about SQL queries can go here.
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
