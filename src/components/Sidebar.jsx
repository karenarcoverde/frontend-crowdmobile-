import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';

const Sidebar = ({ data, searchTerm }) => {
  const [open, setOpen] = useState({});

  const toggleCollapse = (index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  return (
    <div>
      {data.map((item, index) => {
        // Filtro aplicado aos nomes das colunas dentro de cada item
        const filteredColumnNames = item.table_info.columns_name.filter((colName) =>
          colName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Apenas exibir o item se o nome da tabela corresponder ou se houver colunas correspondentes
        const isItemVisible =
          item.table_info.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          filteredColumnNames.length > 0;

        return (
          isItemVisible && (
            <div key={index}>
              <div
                onClick={() => toggleCollapse(index)}
                aria-expanded={open[index]}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}
              >
                {open[index] ? <ChevronUp /> : <ChevronDown />}
                <span style={{ marginLeft: '5px' }}>{item.table_info.table_name}</span>
              </div>
              <Collapse in={open[index]}>
                <div style={{ paddingLeft: '20px' }}>
                  {filteredColumnNames.map((colName, colIndex) => (
                    <div key={colIndex}>{colName}</div>
                  ))}
                </div>
              </Collapse>
            </div>
          )
        );
      })}
    </div>
  );
};

export default Sidebar;
