import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function TabFilters({ baseURL, onQueryResult, setIsLoading }) {
    const [filters, setFilters] = useState([]);
    const [filterValues, setFilterValues] = useState({});
    const [intensity, setIntensity] = useState([]);
    const [selectedIntensity, setSelectedIntensity] = useState('');
    const [dateTimeRange, setDateTimeRange] = useState({
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        axios.get(`${baseURL}/get_filters`)
            .then(response => {
                const formattedFilters = response.data[0].jsonb_agg.map(filter => ({
                    name: filter.column_name,
                    options: filter.unique_values,
                }));
                setFilters(formattedFilters);
                let initialValues = {};
                formattedFilters.forEach(filter => {
                    initialValues[filter.name] = '';
                });
                setFilterValues(initialValues);
            })
            .catch(error => {
                console.error('Error fetching filters:', error);
            });

        axios.get(`${baseURL}/get_columns_table`)
            .then(response => {
                const tableInfo = response.data.find(table => table.table_name === "android_extracts_all");
                if (tableInfo && Array.isArray(tableInfo.table_info.columns_name)) {
                    setIntensity(tableInfo.table_info.columns_name);
                } else {
                    console.error('Invalid data structure for column names');
                }
            })
            .catch(error => {
                console.error('Error fetching column names:', error);
            });
    }, [baseURL]);

    const handleSelectChange = (event, filterName) => {
        setFilterValues({
            ...filterValues,
            [filterName]: event.target.value
        });
    };

    const handleDateTimeChange = (event, dateType) => {
        const { value } = event.target;
        setDateTimeRange({
            ...dateTimeRange,
            [dateType]: value
        });
    };

    const handleIntensityChange = (event) => {
        setSelectedIntensity(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const payload = {
            start_date: dateTimeRange.startDate,
            end_date: dateTimeRange.endDate,
            ...filterValues,
            intensity: selectedIntensity
        };
        console.log(payload);
        setIsLoading(true);
        
        axios.post(`${baseURL}/generate_heatmap_byfilter`, payload)
            .then(response => {
                onQueryResult(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error posting data:', error);
                setIsLoading(false);
            });
    
        console.log('Filters submitted:', filterValues);
        console.log('Selected Intensity:', selectedIntensity);
        console.log('Date and Time Range:', dateTimeRange.startDate, dateTimeRange.endDate);
    };

    return (
        <Form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', marginLeft: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', margin: '5px' }}>
                <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date and Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        step="1"  // Allowing second-level precision
                        value={dateTimeRange.startDate}
                        onChange={(e) => handleDateTimeChange(e, 'startDate')}
                    />
                </Form.Group>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', margin: '5px' }}>
                <Form.Group controlId="formEndDate">
                    <Form.Label>End Date and Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        step="1"  // Allowing second-level precision
                        value={dateTimeRange.endDate}
                        onChange={(e) => handleDateTimeChange(e, 'endDate')}
                    />
                </Form.Group>
            </div>
            {filters.map((filter, index) => (
                <div style={{ display: 'flex', alignItems: 'center', margin: '5px' }} key={index}>
                    <Form.Group>
                        <Form.Label>{filter.name}</Form.Label>
                        <Form.Select
                            value={filterValues[filter.name]}
                            onChange={(e) => handleSelectChange(e, filter.name)}
                        >
                            <option value=""> </option>
                            {filter.options.map((option, optionIndex) => (
                                <option key={optionIndex} value={option}>{option}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', margin: '5px' }}>
                <Form.Group controlId="formIntensity">
                    <Form.Label>INTENSITY</Form.Label>
                    <Form.Select value={selectedIntensity} onChange={handleIntensityChange}>
                        <option value=""> </option>
                        {intensity.map((intensityOption, index) => (
                            <option key={index} value={intensityOption}>{intensityOption}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', margin: '5px' }}>
                <Button variant="primary" type="submit">Run Filters</Button>
            </div>
        </Form>
    );
};

export default TabFilters;
