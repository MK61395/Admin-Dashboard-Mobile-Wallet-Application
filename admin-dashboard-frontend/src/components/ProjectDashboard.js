import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    adminID: "",
    title: "",
    description: "",
    targetAmount: "",
    category: "",
    startDate: "",
    endDate: "",
    totalAmountInvested: "",
    roi: "",
    totalRevenueGenerated: "",
    status: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    // Get all projects from API
    axios
      .get("/project/getAllProjects")
      .then((response) => {
        console.log("Projects fetched:", response.data);
        setProjects(response.data);
        setFilteredProjects(response.data); // Initially display all projects
      })
      .catch((error) => {
        console.error("There was an error fetching the projects!", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("Search term changed:", value); // Log input value
    setSearchTerm(value);
    handleSearch(value); // Trigger search with updated value
  };

  const handleSearch = (term) => {
    console.log("Searching with term:", term); // Log current search term
    if (term === "") {
      console.log("Search term is empty. Showing all projects.");
      setFilteredProjects(projects); // Reset to show all projects if term is empty
    } else {
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(term.toLowerCase()) ||
          project.category.toLowerCase().includes(term.toLowerCase())
      );
      console.log("Filtered projects:", filtered); // Log filtered results
      setFilteredProjects(filtered);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editMode
      ? `/project/updateProject/${editingId}`
      : "/project/addProject";
    const method = editMode ? "put" : "post";
    axios({ method, url, data: formData })
      .then((response) => {
        console.log("API Response:", response.data.message || response.data);
        if (!editMode) {
          setProjects([...projects, formData]);
        }
        setEditMode(false);
        setFormData({
          adminID: "",
          title: "",
          description: "",
          targetAmount: "",
          category: "",
          startDate: "",
          endDate: "",
          totalAmountInvested: "",
          roi: "",
          totalRevenueGenerated: "",
          status: "",
        });
      })
      .catch((error) => {
        console.error("Error submitting the project!", error);
      });
  };

  const handleEdit = (project) => {
    setFormData({
      adminID: project.adminID,
      title: project.title,
      description: project.description,
      targetAmount: project.targetamount,
      category: project.category,
      startDate: project.startdate.split("T")[0],
      endDate: project.enddate.split("T")[0],
      totalAmountInvested: project.totalamountinvested,
      roi: project.roi,
      totalRevenueGenerated: project.totalrevenuegenerated,
      status: project.status,
    });
    setEditingId(project.projectid);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`/project/deleteProject/${id}`)
      .then(() => {
        setProjects(projects.filter((project) => project.projectid !== id));
      })
      .catch((error) => {
        console.error("Error deleting the project!", error);
      });
  };

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Project Dashboard</h1>

      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="search-button"
          onClick={() => handleSearch(searchTerm)}
        >
          <span className="material-icons">Search</span>
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Target Amount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total Amount Invested</th>
              <th>ROI</th>
              <th>Total Revenue</th>
              <th>Status</th>
              <th>Admin Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.projectid}>
                <td>{project.projectid}</td>
                <td>{project.title}</td>
                <td>{project.category}</td>
                <td>{project.targetamount}</td>
                <td>{new Date(project.startdate).toLocaleDateString()}</td>
                <td>{new Date(project.enddate).toLocaleDateString()}</td>
                <td>{project.totalamountinvested}</td>
                <td>{project.roi}</td>
                <td>{project.totalrevenuegenerated}</td>
                <td>{project.status}</td>
                <td>{project.adminname}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(project.projectid)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{editMode ? "Edit Project" : "Add New Project"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="adminID">Admin ID</label>
          <input
            type="number"
            name="adminID"
            value={formData.adminID}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount</label>
          <input
            type="number"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Tech">Tech</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Education">Education</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Bonds">Bonds</option>
            <option value="Stocks">Stocks</option>
            <option value="Wellness">Wellness</option>
            <option value="Hospitality">Hospitality</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalAmountInvested">Total Amount Invested</label>
          <input
            type="number"
            name="totalAmountInvested"
            value={formData.totalAmountInvested}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="roi">ROI</label>
          <input
            type="number"
            name="roi"
            value={formData.roi}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalRevenueGenerated">Total Revenue</label>
          <input
            type="number"
            name="totalRevenueGenerated"
            value={formData.totalRevenueGenerated}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <button
          type="submit"
          className={editMode ? "edit-button" : "add-button"}
        >
          {editMode ? "Update Project" : "Add Project"}
        </button>
        {editMode && (
          <button className="cancel-button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default ProjectDashboard;
