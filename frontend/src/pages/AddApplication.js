import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../authContext";

const AddApplicationPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    company: "",
    job: "",
    jobDetails: "",
    deadline: "",
    contactInfo: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("https://internsightbackend.onrender.com/api/applications", {
        ...formData,
        userId: user.userId,
      });
      setMessage("✅ Application added successfully!");
      setFormData({
        company: "",
        job: "",
        jobDetails: "",
        deadline: "",
        contactInfo: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error adding application.");
    }
  };
  

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📄 Add New Job Application</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="job"
            placeholder="Job Title"
            value={formData.job}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="jobDetails"
            placeholder="Job Details"
            value={formData.jobDetails}
            onChange={handleChange}
            required
            style={{ ...styles.input, height: "100px", resize: "vertical" }}
          />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="contactInfo"
            placeholder="Contact Information"
            value={formData.contactInfo}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            ➕ Add Application
          </button>
        </form>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f7fa, #fce4ec)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
  },
  heading: {
    marginBottom: "20px",
    color: "#333",
    fontSize: "24px",
    fontWeight: "600",
  },
  input: {
    padding: "12px 16px",
    marginBottom: "12px",
    width: "100%",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  success: {
    color: "green",
    marginTop: "16px",
    fontWeight: "500",
  },
  error: {
    color: "red",
    marginTop: "16px",
    fontWeight: "500",
  },
};

export default AddApplicationPage;
