import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Reuse the CSS file

function InvestorDashboard() {
    const [investors, setInvestors] = useState([]);
    const [formData, setFormData] = useState({ name: '', dateOfBirth: '', email: '', password: '', account: '', image: '' });
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
        if (editMode) {
            axios.put(`http://localhost:5000/investor/${editingId}`, formData)
                .then(response => {
                    setInvestors(investors.map(investor => (investor.investorid === editingId ? response.data : investor)));
                    setEditMode(false);
                    setEditingId(null);
                    setFormData({ name: '', dateOfBirth: '', email: '', password: '', account: '', image: '' });
                })
                .catch(error => {
                    console.error('There was an error updating the investor!', error);
                });
        } else {
            axios.post('http://localhost:5000/investor', formData)
                .then(response => {
                    setInvestors([...investors, response.data]);
                    setFormData({ name: '', dateOfBirth: '', email: '', password: '', account: '', image: '' });
                })
                .catch(error => {
                    console.error('There was an error creating the investor!', error);
                });
        }
    };

    const handleEdit = (investor) => {
        setEditMode(true);
        setEditingId(investor.investorid);
        setFormData({
            name: investor.name,
            dateOfBirth: investor.dateofbirth,
            email: investor.email,
            password: investor.password,
            account: investor.account,
            image: investor.image
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

    return (
        <div>
            <h1>Investor Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                <input name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} placeholder="Date of Birth" required />
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                <input name="account" value={formData.account} onChange={handleChange} placeholder="Account" required />
                <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required />
                <button type="submit">{editMode ? 'Update Investor' : 'Add Investor'}</button>
            </form>

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
                            <td>{investor.dateofbirth}</td>
                            <td>{investor.email}</td>
                            <td>{investor.account}</td>
                            <td>
                                <img src={investor.image} alt="Investor" style={{ width: '50px' }} />
                            </td>
                            <td>
                                <button onClick={() => handleEdit(investor)}>Edit</button>
                                <button onClick={() => handleDelete(investor.investorid)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InvestorDashboard;
