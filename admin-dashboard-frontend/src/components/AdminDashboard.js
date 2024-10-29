import React, { useEffect, useState } from 'react';
import api from './apiInstance'; 
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
    const [admins, setAdmins] = useState([]);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetchAdmins();
    }, []);
    

    const fetchAdmins = () => {
        api.get('/admin')
            .then(response => setAdmins(response.data))
            .catch(error => {
                console.error('There was an error fetching the data!', error);
                setError('Failed to fetch admins');
            });
    };

    /*const addAdmin = async () => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
    
        if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }
    
        try {
            const registrationData = {
                name: newAdmin.name,
                email: newAdmin.email,
                password: newAdmin.password
            };
    
            console.log('Attempting to register admin with data:', {
                ...registrationData,
                password: '[HIDDEN]'
            });
    
            let response;
            try {
                // Correct API call
                response = await api.post('/admin', registrationData);
            } catch (firstError) {
                console.log('First attempt failed, trying without credentials...');
                // Attempt without credentials (if necessary)
                response = await axios.post('https://bigbuffalowings.com/auth/admin/register', registrationData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
            }
    
            if (response.data) {
                // Print the message and token from the response
                console.log('Registration successful:', response.data.message);
                console.log('Token:', response.data.token);
    
                // Add to local database
                const localResponse = await axios.post('http://localhost:5000/admin', {
                    ...newAdmin,
                    token: response.data.token // You can keep this if needed
                });
    
                setAdmins([...admins, localResponse.data]);
                setNewAdmin({ name: '', email: '', password: '' });
                setSuccessMessage('Admin registered successfully!');
            }
        } catch (error) {
            console.error('Registration error:', error);
    
            if (error.response) {
                const errorMessage = error.response.data?.message || error.response.statusText;
                setError(`Server error: ${errorMessage}`);
            } else if (error.request) {
                setError('Unable to reach the server. This might be due to CORS restrictions or network issues.');
            } else {
                setError(`Request failed: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };*/

    const addAdmin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
    
        if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }
    
        try {
            // First, make the external API call
            const externalResponse = await axios.post('/auth/admin/register', newAdmin);
            console.log('External API Response:', externalResponse.data);
            console.log('Token:', externalResponse.data.token);
    
            // Then, save to local database
            const localResponse = await axios.post('http://localhost:5000/admin', {
                ...newAdmin,
                token: externalResponse.data.token // Include token if needed
            });
    
            // Update the local state with the new admin
            setAdmins([...admins, localResponse.data]);
            setNewAdmin({ name: '', email: '', password: '' });
            setSuccessMessage('Admin added successfully!');
        } catch (err) {
            console.error('Error creating admin:', err);
            
            if (err.response) {
                const errorMessage = err.response.data?.message || err.response.statusText;
                setError(`Server error: ${errorMessage}`);
            } else if (err.request) {
                setError('Unable to reach the server. Please check your connection.');
            } else {
                setError(`Request failed: ${err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    
    

    const updateAdmin = (id) => {
        axios.put(`http://localhost:5000/admin/${id}`, editingAdmin)
            .then(response => {
                setAdmins(admins.map(admin => admin.adminid === id ? response.data : admin));
                setEditingAdmin(null);
                setSuccessMessage('Admin updated successfully!');
                setError('');
            })
            .catch(error => {
                console.error('There was an error updating the admin!', error);
                setError('Failed to update admin');
                setSuccessMessage('');
            });
    };

    const deleteAdmin = (id) => {
        axios.delete(`http://localhost:5000/admin/${id}`)
            .then(() => {
                setAdmins(admins.filter(admin => admin.adminid !== id));
                setSuccessMessage('Admin deleted successfully!');
                setError('');
            })
            .catch(error => {
                console.error('There was an error deleting the admin!', error);
                setError('Failed to delete admin');
                setSuccessMessage('');
            });
    };

    return (
        <div className="dashboard-content">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            
            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                </div>
            )}
            {successMessage && (
                <div className="success-message">
                    <strong>Success:</strong> {successMessage}
                </div>
            )}
            
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map(admin => (
                        <tr key={admin.adminid}>
                            <td>{admin.name}</td>
                            <td>{admin.email}</td>
                            <td>{admin.password}</td>
                            <td>
                                <button className="edit-button" onClick={() => setEditingAdmin(admin)}>Edit</button>
                                <button className="delete-button" onClick={() => deleteAdmin(admin.adminid)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Add New Admin</h2>
            <input
                type="text"
                placeholder="Name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            />
            <button className="add-button" onClick={addAdmin}>Add Admin</button>

            {editingAdmin && (
                <div>
                    <h2>Edit Admin</h2>
                    <input
                        type="text"
                        value={editingAdmin.name}
                        onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                    />
                    <input
                        type="email"
                        value={editingAdmin.email}
                        onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                    />
                    <input
                        type="password"
                        value={editingAdmin.password}
                        onChange={(e) => setEditingAdmin({ ...editingAdmin, password: e.target.value })}
                    />
                    <button className="edit-button" onClick={() => updateAdmin(editingAdmin.adminid)}>Update Admin</button>
                    <button className="cancel-button" onClick={() => setEditingAdmin(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;