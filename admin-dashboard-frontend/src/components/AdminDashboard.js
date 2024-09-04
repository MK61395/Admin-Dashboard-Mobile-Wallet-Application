import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
    const [admins, setAdmins] = useState([]);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [editingAdmin, setEditingAdmin] = useState(null);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = () => {
        axios.get('http://localhost:5000/admin')
            .then(response => {
                setAdmins(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    };

    const addAdmin = () => {
        axios.post('http://localhost:5000/admin', newAdmin)
            .then(response => {
                setAdmins([...admins, response.data]);
                setNewAdmin({ name: '', email: '', password: '' });
            })
            .catch(error => {
                console.error('There was an error creating the admin!', error);
            });
    };

    const updateAdmin = (id) => {
        axios.put(`http://localhost:5000/admin/${id}`, editingAdmin)
            .then(response => {
                setAdmins(admins.map(admin => admin.adminid === id ? response.data : admin));
                setEditingAdmin(null);
            })
            .catch(error => {
                console.error('There was an error updating the admin!', error);
            });
    };

    const deleteAdmin = (id) => {
        axios.delete(`http://localhost:5000/admin/${id}`)
            .then(() => {
                setAdmins(admins.filter(admin => admin.adminid !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the admin!', error);
            });
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
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
                                <button onClick={() => setEditingAdmin(admin)}>Edit</button>
                                <button onClick={() => deleteAdmin(admin.adminid)}>Delete</button>
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
            <button onClick={addAdmin}>Add Admin</button>

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
                    <button onClick={() => updateAdmin(editingAdmin.adminid)}>Update Admin</button>
                    <button onClick={() => setEditingAdmin(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
