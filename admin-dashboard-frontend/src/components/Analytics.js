import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Analytics = () => {
    const [adminCount, setAdminCount] = useState(0);
    const [investorCount, setInvestorCount] = useState(0);
    const [projectCount, setProjectCount] = useState(0);
    const [investmentCount, setInvestmentCount] = useState(0);
    const [investorsPerProject, setInvestorsPerProject] = useState([]);

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

                const investorsPerProjectRes = await axios.get('http://localhost:5000/analytics/investors-per-project');
                setInvestorsPerProject(investorsPerProjectRes.data);
            } catch (error) {
                console.error('Error fetching analytics data', error);
            }
        };

        fetchAnalytics();
    }, []);

    const barData = {
        labels: ['Admins', 'Investors', 'Projects', 'Investments'],
        datasets: [
            {
                label: 'Counts',
                data: [adminCount, investorCount, projectCount, investmentCount],
                backgroundColor: ['#0835ca', '#1b5e20', '#ff9800', '#e53935'],
            },
        ],
    };

    const pieData = {
        labels: investorsPerProject.map(item => item.title),
        datasets: [
            {
                label: 'Investors per Project',
                data: investorsPerProject.map(item => item.investorCount),
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            },
        ],
    };

    return (
        <div>
            <h1>Analytics</h1>
            <h2>User and Resource Statistics</h2>
            <Bar data={barData} />
            <h2>Investors per Project</h2>
            {investorsPerProject.length > 0 ? (
                <Pie data={pieData} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default Analytics;