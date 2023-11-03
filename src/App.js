import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from './components/Sidebar';
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100vh;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const LeftDiv = styled.div`
  flex: 8;
  background-color: #ffff;

  @media (max-width: 960px) {
    width: 100%;
  }
`;

const RightDiv = styled.div`
  flex: 2;
  overflow-y: auto;
  background-color: #f0f0f0;

  @media (max-width: 960px) {
    display: none;
  }
`;

const baseURL = `http://127.0.0.1:5000`;
function App() {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}/get_columns_table`)
      .then((response) => {
        setColumns(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setColumns(null);
      })

  }, []);
  
  return (
    <Container>
      <LeftDiv>
      </LeftDiv>
      <RightDiv>
        <Sidebar data={columns} />
      </RightDiv>
    </Container>

  );
}

export default App;
