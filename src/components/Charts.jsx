import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Charts = ({ chartsData }) => {
  if (!chartsData || chartsData.length === 0) return null;

  const barChartsData = chartsData.filter(chart => chart.type === 'bar');
  const pieChartData = chartsData.find(chart => chart.type === 'pie');

  return (
    <div className="charts-container mb-4">
      <div className="flex flex-col lg:flex-row justify-around">
        {barChartsData.map(chart => (
          <div key={chart.chartId} className="w-full lg:w-1/2 p-4">
            <Bar
              data={{
                labels: chart.labels,
                datasets: [{
                  label: chart.yAxisCaption,
                  data: chart.data,
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: chart.chartId,
                    font: { size: 20 }
                  },
                },
              }}
            />
          </div>
        ))}
      </div>
      {pieChartData && (
        <div className="w-full p-4 flex justify-center">
          <div className="relative w-96 h-96">
            <Pie
              data={{
                labels: pieChartData.labels,
                datasets: [{
                  data: pieChartData.data,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                  ],
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: pieChartData.chartId,
                    font: { size: 20 }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        if (context.parsed) {
                          const total = pieChartData.data.reduce((a, b) => a + b, 0);
                          const percentage = (context.parsed / total * 100).toFixed(2);
                          return `${label}: ${percentage}%`;
                        }
                        return label;
                      }
                    }
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;
