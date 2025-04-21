import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../authContext";

const HomePage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/applications?userId=${user.userId}`
        );
        setApplications(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching applications.");
      }
    };

    if (user && user.userId) {
      fetchApplications();
    }
  }, [user]);

  if (!user || !user.userId) {
    return (
      <div style={styles.centeredContainer}>
        <h2>Please log in to access your applications.</h2>
      </div>
    );
  }

  const handleSkillRecommendations = async (company, job) => {
    setLoading(true);
    setModalVisible(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/applications/skillRecommendations",
        { userId: user.userId, company, job },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOutput({ type: "skills", data: response.data.skillRecommendations });
    } catch (err) {
      setOutput({ type: "error", message: err.response?.data?.message || "Error fetching skill recommendations." });
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewPrep = async (company, job) => {
    setLoading(true);
    setModalVisible(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/applications/interviewPrep",
        { userId: user.userId, company, job },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOutput({ type: "interview", data: response.data.recommendations });
    } catch (err) {
      setOutput({ type: "error", message: err.response?.data?.message || "Error fetching interview prep tips." });
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAnalysis = async (company, job) => {
    setLoading(true);
    setModalVisible(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/applications/skillAnalysis",
        { userId: user.userId, company, job },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOutput({ type: "skillAnalysis", data: response.data });
    } catch (err) {
      setOutput({ type: "error", message: err.response?.data?.message || "Error fetching skill analysis." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplications(applications.filter((app) => app._id !== applicationId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting application.");
    }
  };

  const truncateText = (text, maxLines = 4) => {
    const lineLimit = 100 * maxLines;
    return text.length > lineLimit ? `${text.substring(0, lineLimit)}...` : text;
  };

  return (
    <div style={styles.container}>
      <h2>Applications</h2>
      {error && <p style={styles.errorText}>{error}</p>}
      {applications.length > 0 ? (
        <ul style={styles.list}>
          {applications.map((app) => (
            <li key={app._id} style={styles.applicationCard}>
              <h4>{app.company}</h4>
              <p><strong>Job:</strong> {app.job}</p>
              <p><strong>Details:</strong> {truncateText(app.jobDetails)}</p>
              <p><strong>Deadline:</strong> {new Date(app.deadline).toLocaleDateString()}</p>
              <p><strong>Contact Info:</strong> {app.contactInfo}</p>
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => handleSkillRecommendations(app.company, app.job)}
                  style={styles.buttonPrimary}
                >
                  Get Skill Recommendations
                </button>
                <button
                  onClick={() => handleInterviewPrep(app.company, app.job)}
                  style={styles.buttonSuccess}
                >
                  Get Interview Prep Tips
                </button>
                <button
                  onClick={() => handleSkillAnalysis(app.company, app.job)}
                  style={styles.buttonSecondary}
                >
                  Skill Analysis for Job
                </button>
                <button
                  onClick={() => handleDeleteApplication(app._id)}
                  style={styles.buttonDanger}
                >
                  Delete Application
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications found.</p>
      )}

      {/* Modal for displaying output */}
      {modalVisible && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <button
              onClick={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              X
            </button>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {output?.type === "skills" && (
                  <div>
                    <h4>Recommended Skills:</h4>
                    <ul style={styles.scrollableList}>
                      {output.data.map((skill, index) => (
                        <li key={index} style={styles.itemCard}>
                          <strong>{skill.skill}</strong>
                          <p><strong>Course:</strong> {skill.courseName}</p>
                          <p><strong>Provider:</strong> {skill.provider}</p>
                          <p><strong>Description:</strong> {skill.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {output?.type === "interview" && (
                  <div>
                    <h4>Interview Prep Tips:</h4>
                    <ul style={styles.scrollableList}>
                      {output.data.map((tip, index) => (
                        <li key={index} style={styles.itemCard}>
                          <p><strong>Platform Name:</strong> {tip.platformName}</p>
                          <p><strong>URL:</strong> {tip.url}</p>
                          <p><strong>Focus:</strong> {tip.focus}</p>
                          <p><strong>Category:</strong> {tip.category}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {output?.type === "skillAnalysis" && (
                  <div>
                    <h4>Skill Analysis:</h4>
                    <div style={styles.itemCard}>
                      <p><strong>Matched Skills:</strong> {output.data.matchedSkills.join(", ")}</p>
                      <p><strong>Improve Skills:</strong> {output.data.improveSkills.join(", ")}</p>
                      <p><strong>Missing Skills:</strong> {output.data.missingSkills.join(", ")}</p>
                    </div>
                  </div>
                )}

                {output?.type === "error" && (
                  <p style={styles.errorText}>{output.message}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles object for the page
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
    padding: "20px",
  },
  centeredContainer: {
    textAlign: "center",
    padding: "20px",
  },
  errorText: {
    color: "red",
    margin: "10px 0",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  applicationCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  buttonPrimary: {
    background: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonSuccess: {
    background: "#28a745",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonSecondary: {
    background: "#6c757d",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonDanger: {
    background: "#dc3545",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    maxWidth: "600px",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "5px 10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
  },
  scrollableList: {
    maxHeight: "300px",
    overflowY: "auto",
  },
  itemCard: {
    backgroundColor: "#f1f1f1",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
};

export default HomePage;
