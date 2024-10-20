import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({});

  const fetchStatistics = async () => {
    try {
      const { data } = await axios.get(`/api/statistics`, {
        params: { month: selectedMonth }
      });
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div>
      <h2>Statistics</h2>
      <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;
