import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InvestmentDashboard.css"; // Import the CSS file

function InvestmentDashboard() {
  const [investments, setInvestments] = useState([]);
  const [formData, setFormData] = useState({
    investorID: "",
    projectID: "",
    amount: "",
    investedDate: "",
    profitOrLoss: "",
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/investment");
      setInvestments(response.data);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0]; // Single file
    setMediaFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || isNaN(formData.amount)) {
      alert("Amount is required and must be a number.");
      return;
    }

    try {
      const investmentData = {
        investorID: formData.investorID,
        projectID: formData.projectID,
        amount: formData.amount,
        investedDate: new Date(formData.investedDate)
          .toISOString()
          .split("T")[0],
        profitOrLoss: formData.profitOrLoss,
        media: mediaFile ? mediaFile.name : null,
      };

      let investmentResponse;
      if (editMode) {
        investmentResponse = await axios.put(
          `http://localhost:5000/investment/${editingId}`,
          investmentData
        );
      } else {
        investmentResponse = await axios.post(
          "http://localhost:5000/investment",
          investmentData
        );
      }

      const investment = investmentResponse.data;

      if (mediaFile) {
        const formData = new FormData();
        formData.append("media", mediaFile);

        await axios.post(
          `http://localhost:5000/investment/${investment.investmentid}/media`,
          formData
        );
      }

      fetchInvestments();
    } catch (error) {
      console.error("There was an error submitting the investment!", error);
    }
  };

  const handleEdit = (investment) => {
    // Convert date to PKT
    const date = new Date(investment.investeddate);
    const pakistanTimeOffset = 5 * 60; // PKT is UTC+5 hours in minutes
    const localDate = new Date(date.getTime() + pakistanTimeOffset * 60000);
    const formattedDate = localDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD

    setFormData({
      investorID: investment.investorid,
      projectID: investment.projectid,
      amount: investment.amount,
      investedDate: formattedDate, // Use the adjusted date
      profitOrLoss: investment.profitorloss,
    });
    setEditingId(investment.investmentid);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/investment/${id}`)
      .then(() => {
        setInvestments(
          investments.filter((investment) => investment.investmentid !== id)
        );
      })
      .catch((error) => {
        console.error("There was an error deleting the investment!", error);
      });
  };

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Investment Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Investor</th>
            <th>Project</th>
            <th>Amount</th>
            <th>Invested Date</th>
            <th>Profit/Loss</th>
            <th>Media</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => (
            <tr key={investment.investmentid}>
              <td>{investment.investorid}</td>
              <td>{investment.projectid}</td>
              <td>{investment.amount}</td>
              <td>{new Date(investment.investeddate).toLocaleDateString()}</td>
              <td>{investment.profitorloss}</td>
              <td>
                {investment.media ? (
                  <img
                    src={`http://localhost:5000/uploads/${investment.media}`}
                    alt="Investment Media"
                    width="100"
                  />
                ) : (
                  <span>No Media</span>
                )}
              </td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(investment)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(investment.investmentid)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{editMode ? "Edit Investment" : "Add New Investment"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="investorID">Investor ID</label>
          <input
            type="number"
            name="investorID"
            value={formData.investorID}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectID">Project ID</label>
          <input
            type="number"
            name="projectID"
            value={formData.projectID}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="investedDate">Invested Date</label>
          <input
            type="date"
            name="investedDate"
            value={formData.investedDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="profitOrLoss">Profit or Loss</label>
          <input
            type="text"
            name="profitOrLoss"
            value={formData.profitOrLoss}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="media">Media</label>
          <input type="file" name="media" onChange={handleMediaChange} />
        </div>

        <button
          className={editMode ? "edit-button" : "add-button"}
          type="submit"
        >
          {editMode ? "Update Investment" : "Add Investment"}
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

export default InvestmentDashboard;
