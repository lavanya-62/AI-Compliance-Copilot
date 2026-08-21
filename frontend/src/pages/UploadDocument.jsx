import { useState } from "react";
import axios from "axios";
import "./UploadDocument.css";

function UploadDocument() {
  const API_URL = "https://ai-compliance-copilot-pfq8.onrender.com";

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a document first.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      setUploading(true);
      setMessage("");

      const response = await axios.post(
        `${API_URL}/upload`,
        formData
      );

      console.log(response.data);

      setMessage("✅ Document uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload Compliance Documents</h1>

      <p className="subtitle">
        Upload your MSME documents for AI Compliance Analysis
      </p>

      <div className="upload-box">
        <div className="upload-icon">📄</div>

        <h2>Drag & Drop Files</h2>

        <p>or</p>

        <input
          type="file"
          onChange={handleFile}
          accept=".pdf,.jpg,.png,.doc,.docx"
        />

        {file && (
          <p>
            Selected: <strong>{file.name}</strong>
          </p>
        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>

      <div className="supported">
        Supported Files: PDF, DOCX, JPG, PNG
      </div>

      {message && (
        <div className="upload-message">
          {message}
        </div>
      )}
    </div>
  );
}

export default UploadDocument;