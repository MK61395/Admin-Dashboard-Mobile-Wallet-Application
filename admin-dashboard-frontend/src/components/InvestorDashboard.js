import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';  // Reuse the CSS file

function InvestorDashboard() {
    const [investors, setInvestors] = useState([]);
    const [formData, setFormData] = useState({ name: '', dateOfBirth: '', email: '', password: '', account: 'Active' });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/investor')
            .then(response => {
                setInvestors(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editMode 
            ? `http://localhost:5000/investor/${editingId}`
            : 'http://localhost:5000/investor';
        const method = editMode ? 'put' : 'post';
        axios({ method, url, data: formData })
            .then(response => {
                if (editMode) {
                    setInvestors(investors.map(investor => (investor.investorid === editingId ? response.data : investor)));
                    setEditMode(false);
                    setEditingId(null);
                } else {
                    setInvestors([...investors, response.data]);
                }
                setFormData({ name: '', dateOfBirth: '', email: '', password: '', account: 'Active' });
            })
            .catch(error => {
                console.error('There was an error processing the investor!', error);
            });
    };

    const handleEdit = (investor) => {
        setEditMode(true);
        setEditingId(investor.investorid);
    
        const date = new Date(investor.dateofbirth);
        const pakistanTimeOffset = 5 * 60; // PKT is UTC+5 hours in minutes
        const localDate = new Date(date.getTime() + pakistanTimeOffset * 60000);
    
        const formattedDate = localDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    
        setFormData({
            name: investor.name,
            dateOfBirth: formattedDate, // Use the adjusted date
            email: investor.email,
            password: investor.password,
            account: investor.account
        });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/investor/${id}`)
            .then(() => {
                setInvestors(investors.filter(investor => investor.investorid !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the investor!', error);
            });
    };

    // Helper function to generate image URL based on investor name
    const getInvestorImage = (name) => {
        const cleanName = name.replace(/\s/g, ''); // Remove spaces in the name
        return `/images/${cleanName}.png`; // Assuming images are .png. Adjust extension as necessary.
    };

    return (
        <div className="dashboard-content">
            <h1 className="dashboard-title">Investor Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Email</th>
                        <th>Account</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {investors.map(investor => (
                        <tr key={investor.investorid}>
                            <td>{investor.name}</td>
                            <td>
                            {new Date(investor.dateofbirth).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                })}
                            </td>
                            <td>{investor.email}</td>
                            <td>{investor.account}</td>
                            <td>
                                <img 
                                    src={getInvestorImage(investor.name)} 
                                    alt={investor.name} 
                                    onError={(e) => { e.target.src = '/images/default.png'; }} // Fallback image
                                    style={{ width: '50px' }} 
                                />
                            </td>
                            <td>
                                <button className="edit-button" onClick={() => handleEdit(investor)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(investor.investorid)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>{editMode ? 'Edit Investor' : 'Add New Investor'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <select
                    name="account"
                    value={formData.account}
                    onChange={handleChange}
                    required
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                </select>
                <button type="submit" className={editMode ? "edit-button" : "add-button"}>
                    {editMode ? 'Update Investor' : 'Add Investor'}
                </button>
                {editMode && (
                    <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
                )}
            </form>
        </div>
    );
}

export default InvestorDashboard;