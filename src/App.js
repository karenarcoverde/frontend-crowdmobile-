import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from './components/Sidebar';
import styled from "styled-components";
import { Form, FormControl } from 'react-bootstrap';

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

const SearchContainer = styled.div`
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
`;


const baseURL = `http://127.0.0.1:5000`;
function App() {
  const [columns, setColumns] = useState([]);
  const [filteredColumns, setFilteredColumns] = useState([]);
  const [searchTable, setSearchTable] = useState('');
  const [searchColumn, setSearchColumn] = useState('');

  useEffect(() => {
    axios.get(`${baseURL}/get_columns_table`)
      .then((response) => {
        setColumns(response.data);
        setFilteredColumns(response.data); // Initially, all data is shown
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setColumns([]);
      });
  }, []);

  useEffect(() => {
    let filteredData = columns;
  
    // Filter by table name
    if (searchTable) {
      filteredData = filteredData.filter(item =>
        item.table_info.table_name.toLowerCase().includes(searchTable.toLowerCase())
      );
    }
  
    // Filter by column name within each table
    if (searchTable && searchColumn) {
      filteredData = filteredData.map(item => {
        const filteredColumns = item.table_info.columns_name.filter(columnName =>
          columnName.toLowerCase().includes(searchColumn.toLowerCase())
        );
        // Only return the table if it has matching columns
        if (filteredColumns.length > 0) {
          return { ...item, table_info: { ...item.table_info, columns_name: filteredColumns } };
        }
        return null;
      }).filter(Boolean); // Remove null entries where no columns matched
    }
  
    setFilteredColumns(filteredData);
  }, [searchTable, searchColumn, columns]);

  return (
    <Container>
      <LeftDiv>
        {/* LeftDiv content goes here */}
      </LeftDiv>
      <RightDiv>
        <SearchContainer>
          <Form>
            <FormControl
              type="text"
              placeholder="Search by table name..."
              className="mr-sm-2 mb-2"
              value={searchTable}
              onChange={e => setSearchTable(e.target.value)}
            />
            {searchTable && (
              <FormControl
                type="text"
                placeholder="Search by column name..."
                className="mr-sm-2"
                value={searchColumn}
                onChange={e => setSearchColumn(e.target.value)}
              />
            )}
          </Form>
        </SearchContainer>
        <Sidebar data={filteredColumns} />
      </RightDiv>
    </Container>
  );
}

export default App;