import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Import the CSS file

function ProjectDashboard() {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        adminID: '',
        title: '',
        description: '',
        targetAmount: '',
        startDate: '',
        endDate: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/project')
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editMode
            ? `http://localhost:5000/project/${editingId}`
            : 'http://localhost:5000/project';
        const method = editMode ? 'put' : 'post';
        axios({ method, url, data: formData })
            .then(response => {
                if (editMode) {
                    setProjects(projects.map(project =>
                        project.projectid === editingId ? response.data : project
                    ));
                    setEditMode(false);
                } else {
                    setProjects([...projects, response.data]);
                }
                setFormData({
                    adminID: '',
                    title: '',
                    description: '',
                    targetAmount: '',
                    startDate: '',
                    endDate: ''
                });
            })
            .catch(error => {
                console.error('There was an error submitting the project!', error);
            });
    };

    const handleEdit = (project) => {
        setFormData({
            adminID: project.adminid,
            title: project.title,
            description: project.description,
            targetAmount: project.targetamount,
            startDate: project.startdate,
            endDate: project.enddate
        });
        setEditingId(project.projectid);
        setEditMode(true);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/project/${id}`)
            .then(() => {
                setProjects(projects.filter(project => project.projectid !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the project!', error);
            });
    };

    return (
        <div>
            <h1>Project Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="adminID"
                    placeholder="Admin ID"
                    value={formData.adminID}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="targetAmount"
                    placeholder="Target Amount"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="startDate"
                    placeholder="Start Date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="endDate"
                    placeholder="End Date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">
                    {editMode ? 'Update Project' : 'Add Project'}
                </button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Admin ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Target Amount</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.projectid}>
                            <td>{project.adminid}</td>
                            <td>{project.title}</td>
                            <td>{project.description}</td>
                            <td>{project.targetamount}</td>
                            <td>{new Date(project.startdate).toLocaleDateString()}</td>
                            <td>{new Date(project.enddate).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleEdit(project)}>Edit</button>
                                <button onClick={() => handleDelete(project.projectid)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProjectDashboard;