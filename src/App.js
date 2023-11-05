import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from './components/Sidebar';
import TabFilters from './components/TabFilters';
import TabSQL from './components/TabSQL';
import HeatMap from './components/HeatMap';
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
  display: flex;
  flex-direction: column;
  background-color: #ffff;
  height: 100vh;

  @media (max-width: 960px) {
    width: 100%;
    height: auto;
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
  margin: 20px;
  background-color: #f5f5f5;
  padding: 5px 5px 0 5px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ddd;

  .nav {
    width: 100%;
  }

  .nav-item {
    flex: 1;
    text-align: center;

    .nav-link {
      color: #777;
      width: 100%;

      &:hover {
        color: #777;
        background-color: #e9e9e9;
      }

      &.active {
        color: #777;
        background-color: #fff;
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
            <TabFilters />
          </Tab>
          <Tab eventKey="sql" title="SQL">
            <TabSQL />
          </Tab>
        </StyledTabs>
        <HeatMap />
      </LeftDiv>
      <RightDiv>
        <Sidebar data={columns} />
      </RightDiv>
    </Container>
  );
}

export default App;