import React, { useState, useEffect } from 'react';
import { Collapse, Form, FormControl } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import styled from 'styled-components';

const SearchContainer = styled.div`
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
`;

const Sidebar = ({ data }) => {
  const [open, setOpen] = useState({});
  const [filteredColumns, setFilteredColumns] = useState([]);
  const [searchTable, setSearchTable] = useState('');
  const [searchColumn, setSearchColumn] = useState('');

  const toggleCollapse = (index) => {
    setOpen(prevOpen => ({
      ...prevOpen,
      [index]: !prevOpen[index]
    }));
  };

  useEffect(() => {
    let filteredData = data;

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
        if (filteredColumns.length > 0) {
          return { ...item, table_info: { ...item.table_info, columns_name: filteredColumns } };
        }
        return null;
      }).filter(Boolean);
    }

    setFilteredColumns(filteredData);
  }, [searchTable, searchColumn, data]);

  const clearFilters = () => {
    setSearchTable('');
    setSearchColumn('');
  };

  return (
    <>
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
            <>
              <FormControl
                type="text"
                placeholder="Search by column name..."
                className="mr-sm-2 mb-2"
                value={searchColumn}
                onChange={e => setSearchColumn(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary mb-2 w-100"
                onClick={clearFilters}
              >
                Clear
              </button>
            </>
          )}
        </Form>
      </SearchContainer>
      <div>
        {filteredColumns.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => toggleCollapse(index)}
              aria-expanded={open[index]}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', marginLeft: '20px' }}
            >
              {open[index] ? <ChevronUp /> : <ChevronDown />}
              <span style={{ marginLeft: '5px' }}>{item.table_info.table_name}</span>
            </div>
            <Collapse in={open[index]}>
              <div style={{ paddingLeft: '40px' }}>
                {item.table_info.columns_name.map((colName, colIndex) => (
                  <div key={colIndex}>{colName}</div>
                ))}
              </div>
            </Collapse>
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;