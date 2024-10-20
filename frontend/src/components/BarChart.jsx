import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarChart = ({ selectedMonth }) => {
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of items',
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        data: []
      }
    ]
  });

  const fetchBarChartData = async () => {
    try {
      const { data } = await axios.get(`/api/bar-chart`, {
        params: { month: selectedMonth }
      });
      
      const labels = data.map(item => item.range);
      const values = data.map(item => item.count);

      setBarChartData({
        labels,
        datasets: [{
          label: 'Number of items',
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          data: values
        }]
      });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
      setBarChartData({
        labels: [],
        datasets: [{
          label: 'Number of items',
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          data: []
        }]
      });
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  if (!barChartData.labels.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Bar Chart (Price Range)</h2>
      <Bar
        data={barChartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }}
      />
    </div>
  );
};

export default BarChart;
