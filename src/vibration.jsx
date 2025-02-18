import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const Vibration = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const url ="http://localhost:3000/todos";
        const motorId = "1"
        const fetchData = async () => {
            try {
                const response = await axios.get(url, { motor_id: motorId });
                if (Array.isArray(response.data)) {
                    const newData = response.data.map(item => {
                        const date = new Date(item.timestamp);
                        if (isNaN(date)) {
                            console.error('Invalid timestamp format:', item.timestamp);
                            return null;
                        }
                        return {
                            time: date.toLocaleTimeString(),
                            temperature: item.temperature,
                        };
                    }).filter(item => item !== null);
                    setData(prevData => [...prevData, ...newData]);
                }
            } catch (error) {
                console.error('Failed to fetch data from API', error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <LineChart
            width={500}
            height={300}
            data={data.slice(-5)}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="5 2" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="linear" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    );
};

export default Vibration;