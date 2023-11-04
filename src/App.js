import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from './components/Sidebar';
import styled from "styled-components";
import { Tabs, Tab } from 'react-bootstrap';

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
  background-color: #ffff;

  @media (max-width: 960px) {
    display: none;
  }
`;

const StyledTabs = styled(Tabs)`
  // Set the border for the tabs container
  border: 1px solid #ddd;
  color: #333;
  margin: 20px;
  background-color: #f5f5f5;
  padding: 5px 5px 0 5px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;

  // Override the default width of nav-tabs
  .nav {
    display: flex; // This will make tabs take equal space
    margin-bottom: 0; // Remove if any margin is applied
    width: 100%; // Set width to fill the parent
    border-color: #fff;
  }

  .nav-item {
    flex: 1; // This will make each tab take equal space
    text-align: center; // This will center the tab titles

    .nav-link {
      display: block; // Make the link fill the .nav-item container
      width: 100%; // Ensure it fills the width
      height: 100%; // Ensure it fills the height (if necessary)
      padding: 0.5rem 1rem; // Adjust padding as needed

      // Default state
      color: #777;

      // Hover state
      &:hover {
        color: #777;
        background-color: #e9e9e9;
      }

      // Active state
      &.active {
        color: #333;
        background-color: #fff;
        border-color: #ccc;
        border-bottom-color: transparent;
      }
    }
  }
`;


const baseURL = `http://127.0.0.1:5000`;
function App() {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    axios.get(`${baseURL}/get_columns_table`)
      .then((response) => {
        setColumns(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setColumns([]);
      });
  }, []);


  return (
    <Container>
      <LeftDiv>
        <StyledTabs defaultActiveKey="filters" id="uncontrolled-tab-example">
          <Tab eventKey="filters" title="Filters">
            {/* Tab content */}
          </Tab>
          <Tab eventKey="sql" title="SQL">
            {/* Tab content */}
          </Tab>
        </StyledTabs>
      </LeftDiv>
      <RightDiv>
        <Sidebar data={columns} />
      </RightDiv>
    </Container>
  );
}

export default App;