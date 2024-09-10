import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import './Analytics.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    Tooltip,
    Legend,
    PointElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

const Analytics = () => {
    const [adminCount, setAdminCount] = useState(0);
    const [investorCount, setInvestorCount] = useState(0);
    const [projectCount, setProjectCount] = useState(0);
    const [investmentCount, setInvestmentCount] = useState(0);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const adminRes = await axios.get('http://localhost:5000/analytics/admin');
                setAdminCount(adminRes.data.count);

                const investorRes = await axios.get('http://localhost:5000/analytics/investor');
                setInvestorCount(investorRes.data.count);

                const projectRes = await axios.get('http://localhost:5000/analytics/project');
                setProjectCount(projectRes.data.count);

                const investmentRes = await axios.get('http://localhost:5000/analytics/investment');
                setInvestmentCount(investmentRes.data.count);

            } catch (error) {
                console.error('Error fetching analytics data', error);
            }
        };

        fetchAnalytics();
    }, []);

    // Bar chart data
    const barData = {
        labels: ['Admins', 'Investors', 'Projects', 'Investments'],
        datasets: [
            {
                label: 'Counts',
                data: [adminCount, investorCount, projectCount, investmentCount],
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            },
        ],
    };
    

    // Pie chart data
    const pieData = {
        labels: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Utilities'],
        datasets: [
            {
                label: 'Stock Market Distribution',
                data: [30, 25, 20, 15, 10],
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0'],
            },
        ],
    };

    // Line chart data (e.g., growth over time)
    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Growth Rate',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#0835ca',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    // Doughnut chart data (e.g., resource allocation)
    const doughnutData = {
        labels: ['Development', 'Marketing', 'Sales', 'Operations'],
        datasets: [
            {
                label: 'Budget Allocation',
                data: [40, 20, 25, 15],
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            },
        ],
    };

    return (
        <div className="dashboard-content">
            <h1 className="dashboard-title">Analytics Dashboard</h1>
            <div className="card-container">
                <div className="card">
                    <h2>User and Resource Statistics</h2>
                    <div className="chart-container">
                        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="card">
                    <h2>Stock Market Distribution</h2>
                    <div className="chart-container">
                        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
            <div className="card-container">
                <div className="card">
                    <h2>Growth Over Time</h2>
                    <div className="chart-container">
                        <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="card">
                    <h2>Budget Allocation</h2>
                    <div className="chart-container">
                        <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
