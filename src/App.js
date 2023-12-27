import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from './components/Sidebar';
import TabFilters from './components/TabFilters';
import TabSQL from './components/TabSQL';
import HeatMap from './components/HeatMap';
import styled from "styled-components";
import { Tabs, Tab } from 'react-bootstrap';

const Header = styled.header`
  background-color: #dcdcdc;
  color: #808080;
  height: 60px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: 960px) {
    justify-content: center;
  }
`;

const Container = styled.div`
  display: flex;
  height: calc(100vh - 60px); // Subtract the height of the header

  @media (max-width: 915px), (max-height: 915px) {
    flex-direction: column-reverse;
  }
`;

const LeftDiv = styled.div`
  flex: 1; // Takes remaining space
  display: flex;
  flex-direction: column;
  background-color: #ffff;
  overflow-y: auto; // Add scroll if content is too long
`;

const RightDiv = styled.div`
  flex: 0 0 20%;
  overflow-y: auto;
  background-color: #ffff;
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
  const [queryResult, setQueryResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryResult = (data) => {
    setQueryResult(data);
  };


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
    <>
      <Header>
        <img src="/favicon.ico" alt="Logo" style={{ height: '30px', marginRight: '10px' }} />
        Mobile Networks Heat Map
      </Header>
      <Container>
        <LeftDiv>
          <StyledTabs defaultActiveKey="filters" id="uncontrolled-tab-example">
            <Tab eventKey="filters" title="Filters">
              <TabFilters baseURL={baseURL} onQueryResult={handleQueryResult} setIsLoading={setIsLoading} />
            </Tab>
            <Tab eventKey="sql" title="SQL">
              <TabSQL baseURL={baseURL} onQueryResult={handleQueryResult} setIsLoading={setIsLoading} />
            </Tab>
          </StyledTabs>
          <HeatMap data={queryResult} isLoading={isLoading} />
        </LeftDiv>
        <RightDiv>
          <Sidebar data={columns} />
        </RightDiv>
      </Container>
    </>
  );
}

export default App;