import React, { useEffect, useState } from "react";
import api from "./apiInstance";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      console.log("Search term is empty. Showing all admins.");
      setFilteredProjects(admins); // Reset to show all admins if term is empty
    } else {
      const filtered = admins.filter((admin) =>
        admin.name.toLowerCase().includes(term.toLowerCase())
      );
      console.log("Filtered admins:", filtered); // Log filtered results
      setFilteredProjects(filtered);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Update to set the initial value for filteredProjects
useEffect(() => {
    setFilteredProjects(admins);
  }, [admins]);

  const fetchAdmins = () => {
    api
    .get("/admin")
    .then((response) => {
      setAdmins(response.data);
      setFilteredProjects(response.data); // Set both admins and filteredProjects initially
    })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setError("Failed to fetch admins");
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
    setError("");
    setSuccessMessage("");

    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // First, make the external API call
      const externalResponse = await axios.post(
        "/auth/admin/register",
        newAdmin
      );
      console.log("External API Response:", externalResponse.data);
      console.log("Token:", externalResponse.data.token);

      // Then, save to local database
      const localResponse = await axios.post("http://localhost:5000/admin", {
        ...newAdmin,
        token: externalResponse.data.token, // Include token if needed
      });

      // Update the local state with the new admin
      setAdmins([...admins, localResponse.data]);
      setNewAdmin({ name: "", email: "", password: "" });
      setSuccessMessage("Admin added successfully!");
    } catch (err) {
      console.error("Error creating admin:", err);

      if (err.response) {
        const errorMessage =
          err.response.data?.message || err.response.statusText;
        setError(`Server error: ${errorMessage}`);
      } else if (err.request) {
        setError("Unable to reach the server. Please check your connection.");
      } else {
        setError(`Request failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdmin = (id) => {
    axios
      .put(`http://localhost:5000/admin/${id}`, editingAdmin)
      .then((response) => {
        setAdmins(
          admins.map((admin) => (admin.adminid === id ? response.data : admin))
        );
        setEditingAdmin(null);
        setSuccessMessage("Admin updated successfully!");
        setError("");
      })
      .catch((error) => {
        console.error("There was an error updating the admin!", error);
        setError("Failed to update admin");
        setSuccessMessage("");
      });
  };

  const deleteAdmin = (id) => {
    axios
      .delete(`http://localhost:5000/admin/${id}`)
      .then(() => {
        setAdmins(admins.filter((admin) => admin.adminid !== id));
        setSuccessMessage("Admin deleted successfully!");
        setError("");
      })
      .catch((error) => {
        console.error("There was an error deleting the admin!", error);
        setError("Failed to delete admin");
        setSuccessMessage("");
      });
  };

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="search-bar-container">
        <div className="input-wrapper">
          <input
            type="text"
            className="search-bar"
            placeholder="Search by admin name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="search-button"
          onClick={() => handleSearch(searchTerm)}
        >
          Search
        </button>
      </div>

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
          {(searchTerm ? filteredProjects : admins).map((admin) => (
            <tr key={admin.adminid}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.password}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => setEditingAdmin(admin)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteAdmin(admin.adminid)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Admin</h2>
      <form onSubmit={addAdmin}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, email: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newAdmin.password}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, password: e.target.value })
            }
            required
          />
        </div>
        <button className="add-button" type="submit">
          Add Admin
        </button>
      </form>

      {editingAdmin && (
        <div>
          <h2>Edit Admin</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateAdmin(editingAdmin.adminid);
            }}
          >
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={editingAdmin.name}
                onChange={(e) =>
                  setEditingAdmin({ ...editingAdmin, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={editingAdmin.email}
                onChange={(e) =>
                  setEditingAdmin({ ...editingAdmin, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={editingAdmin.password}
                onChange={(e) =>
                  setEditingAdmin({ ...editingAdmin, password: e.target.value })
                }
                required
              />
            </div>
            <button className="edit-button" type="submit">
              Update Admin
            </button>
            <button
              className="cancel-button"
              onClick={() => setEditingAdmin(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
