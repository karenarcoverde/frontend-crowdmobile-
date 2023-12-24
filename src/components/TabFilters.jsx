import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TabFilters = () => {
    const [filters, setFilters] = useState([]);
    const [filterValues, setFilterValues] = useState({});
    const [dateTimeRange, setDateTimeRange] = useState({
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/get_filters')
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
    }, []);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Filters submitted:', filterValues);
        console.log('Date and Time Range:', dateTimeRange.startDate, dateTimeRange.endDate);
    };

    return (
        <Form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', marginLeft: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', margin: '5px' }}>
                <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date and Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
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
                <Button variant="primary" type="submit">Run Filters</Button>
            </div>
        </Form>
    );
};

export default TabFilters;
