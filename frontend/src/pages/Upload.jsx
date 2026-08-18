import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

function Upload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a document first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("🔍 Analyzing your document...");

      
      const storedUser = localStorage.getItem("user");

      let user = null;

      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch (error) {
          console.error("Invalid user data:", error);
        }
      }

     
      const userId =
        user?.id ||
        user?.user_id ||
        user?.userId ||
        1;

      
      const formData = new FormData();

      formData.append("document", file);
      formData.append("userId", userId);

      
      const response = await fetch(
        "http://localhost:5000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      
      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Backend returned:", text);

        throw new Error(
          "Backend returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Document analysis failed."
        );
      }

      console.log("Analysis result:", data);

      
      const riskScore =
        data.riskScore ??
        data.risk_score ??
        0;

     
      const reportData = {
        ...data,
        riskScore: riskScore,
        riskLevel:
          data.riskLevel ||
          data.risk_level ||
          "Unknown",
        findings: Array.isArray(data.findings)
          ? data.findings
          : [],
      };

      localStorage.setItem(
        "complianceReport",
        JSON.stringify(reportData)
      );

      setMessage(
        `✅ Analysis completed! Risk Score: ${riskScore}%`
      );

      setFile(null);

      // Go to Reports after 1 second
      setTimeout(() => {
        navigate("/reports");
      }, 1000);

    } catch (error) {
      console.error(
        "Upload/Analysis Error:",
        error
      );

      setMessage(
        `❌ ${
          error.message ||
          "Analysis failed. Please check the backend."
        }`
      );

    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">

      {/* Header */}

      <div className="upload-header">

        <h1>
          Upload Compliance Documents
        </h1>

        <p>
          Upload your MSME documents for AI
          Compliance Analysis
        </p>

      </div>


      {/* Upload Card */}

      <div className="upload-card">

        <div className="upload-icon">
          📄
        </div>

        <h2>
          Upload & Analyze Documents
        </h2>


        {/* Drop Area */}

        <div className="drop-area">

          <p>
            Drag & drop your compliance document here
          </p>

          <p>
            or
          </p>


          {/* File Input */}

          <input
            type="file"
            className="file-input"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />


          {/* Selected File */}

          {file && (
            <div className="selected-file">

              📎 {file.name}

            </div>
          )}


          {/* Upload Button */}

          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={uploading}
          >

            {uploading
              ? "Analyzing..."
              : "Upload & Analyze"}

          </button>


          {/* Message */}

          {message && (
            <p className="upload-message">
              {message}
            </p>
          )}

        </div>


        {/* Supported Files */}

        <p className="supported-files">
          Supported Files: PDF, DOCX
        </p>

      </div>

    </div>
  );
}

export default Upload;