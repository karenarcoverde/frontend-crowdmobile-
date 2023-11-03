import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';

const Sidebar = ({ data }) => {
  const [open, setOpen] = useState({});

  const toggleCollapse = (index) => {
    setOpen(prevOpen => ({
      ...prevOpen,
      [index]: !prevOpen[index]
    }));
  };

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>
          <div
            onClick={() => toggleCollapse(index)}
            aria-expanded={open[index]}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }} // This makes the div look clickable and prevents text selection
          >
            {/* Chevron icon on the left */}
            {open[index] ? <ChevronUp /> : <ChevronDown />}
            {/* Table name next to the icon */}
            <span style={{ marginLeft: '5px' }}>{item.table_info.table_name}</span>
          </div>
          <Collapse in={open[index]}>
            <div style={{ paddingLeft: '20px' }}> {/* This adds padding to the collapsed content */}
              {item.table_info.columns_name.map((colName, colIndex) => (
                <div key={colIndex}>{colName}</div>
              ))}
            </div>
          </Collapse>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
