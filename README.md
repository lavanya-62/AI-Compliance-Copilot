# 🛡️ AI Compliance Copilot for MSMEs

> **An intelligent compliance assistant that helps MSMEs understand document-level compliance risks, identify potential gaps, and take corrective action.**

AI Compliance Copilot is a full-stack web application built to simplify compliance management for **Micro, Small and Medium Enterprises (MSMEs)**.

Instead of manually reviewing every business document, users can upload a compliance-related document and receive an automated analysis containing a **compliance score, risk classification, findings, recommendations, notifications, and a downloadable PDF report**.

---

## ✨ What Makes It Different?

Small and medium businesses often have to deal with multiple compliance requirements but may not have dedicated compliance teams.

AI Compliance Copilot brings the important information into one place:

**Upload → Analyze → Understand Risk → Take Action → Track History**

The application provides a simple dashboard where business users can monitor their compliance status and review previously analyzed documents.

---

## 🚀 Core Capabilities

| Module                 | What it does                                               |
| ---------------------- | ---------------------------------------------------------- |
| 🔐 Authentication      | Registration, login and protected application routes       |
| 📊 Dashboard           | Displays the latest compliance status and activity         |
| 📤 Document Upload     | Accepts compliance-related business documents              |
| 🔎 Automated Analysis  | Processes uploaded documents for potential compliance gaps |
| 🎯 Compliance Score    | Generates an overall compliance score                      |
| 🚦 Risk Classification | Categorizes findings as High, Medium or Low risk           |
| 📋 Reports             | Presents detailed analysis and recommendations             |
| 📥 PDF Reports         | Allows users to download compliance reports                |
| 🕘 Compliance History  | Maintains previously analyzed documents                    |
| 🔔 Notifications       | Highlights compliance issues requiring attention           |
| 👤 Profile             | Displays user and business information                     |

---

## 🧠 How the System Works

```text
                 ┌─────────────────────┐
                 │       User          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Login / Register  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      Dashboard      │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Upload Document     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Document Analysis   │
                 └──────────┬──────────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
       Compliance       Risk Level      Findings
         Score
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                 ┌─────────────────────┐
                 │ Recommendations     │
                 └──────────┬──────────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
          Compliance Report       Notifications
                 │
          ┌──────┴──────┐
          ▼             ▼
      View Report   Download PDF
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Compliance History  │
                 └─────────────────────┘
```

---

## 🎯 Compliance Risk Model

The analysis classifies identified compliance gaps according to their severity.

### 🔴 High Risk

Issues that may require immediate attention.

### 🟠 Medium Risk

Issues that should be reviewed and addressed.

### 🟢 Low Risk

Lower-severity gaps that should still be monitored.

Each identified finding is accompanied by a recommendation intended to help the business understand the next action.

---

## 📑 Example Compliance Findings

The system can identify missing or undetected information such as:

| Compliance Area     | Risk      | Suggested Action                                  |
| ------------------- | --------- | ------------------------------------------------- |
| GST information     | 🟠 Medium | Verify GST registration and filing information    |
| PAN information     | 🟠 Medium | Verify business PAN details                       |
| Business license    | 🟠 Medium | Verify applicable business licensing requirements |
| Invoice information | 🟢 Low    | Verify required invoice information               |
| Privacy policy      | 🟢 Low    | Review applicable privacy requirements            |
| Data protection     | 🟢 Low    | Review data protection practices                  |
| Labour compliance   | 🟢 Low    | Review applicable labour requirements             |
| Annual filings      | 🟢 Low    | Verify annual filing requirements                 |

> **Note:** Findings are intended as compliance-assistance indicators and should be reviewed against applicable laws, regulations and professional advice.

---

## 📊 Dashboard

The dashboard provides a quick snapshot of the business compliance status.

It includes:

* Current compliance score
* Current risk level
* Documents analyzed
* Issues detected
* High-risk findings
* Medium-risk findings
* Low-risk findings
* Recent compliance activity

This allows users to understand their current compliance position without opening every individual report.

---

## 📋 Compliance Reports

Each analyzed document generates a report containing:

* Overall compliance score
* Risk level
* Total findings
* Severity-wise findings
* Compliance recommendations
* Report viewing option
* PDF download option

---

## 🕘 Compliance History

The Compliance History module provides a centralized record of previously analyzed documents.

Users can:

* View analyzed documents
* Check previous compliance scores
* Review risk levels
* See the number of findings
* Open previous reports
* Download PDF reports
* Start a new analysis

This creates a simple audit trail of document-level compliance analysis.

---

## 🔔 Notifications

Compliance issues are surfaced through the notification module so users can quickly identify areas that require attention.

The notification system complements the dashboard and reports by making important findings easier to notice.

---

## 👤 User Profile

The profile module provides a centralized view of:

* User name
* Email address
* Business name
* Account type
* Documents uploaded
* Compliance reports
* Compliance alerts

---

# 🏗️ Technology Architecture

## Frontend

* ⚛️ React
* ⚡ Vite
* 🧭 React Router
* 🎨 CSS
* 🧩 React Icons

## Backend

* 🟢 Node.js
* 🚂 Express.js
* 📤 Multer
* 📄 PDF processing
* 📝 Mammoth
* 🗄️ MySQL

## Database

**MySQL**

The database stores application, user, document and compliance-report information.

---

# 📁 Project Structure

```text
AI-Compliance-Copilot/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── analysisController.js
│   │   └── uploadController.js
│   │
│   ├── routes/
│   │   ├── analysis.js
│   │   ├── auth.js
│   │   ├── reports.js
│   │   └── upload.js
│   │
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/lavanya-62/AI-Compliance-Copilot.git
cd AI-Compliance-Copilot
```

---

## 2. Configure the Backend

```bash
cd backend
npm install
```

Configure the required MySQL database connection and environment variables.

Start the backend:

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

---

## 3. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🗄️ Database Setup

The application uses **MySQL**.

Before starting the backend:

1. Install MySQL.
2. Create the required database.
3. Configure the database credentials.
4. Update the backend database configuration.
5. Start the backend server.

> Database credentials and other sensitive configuration values should be stored in environment variables and should never be committed to GitHub.

---

# 🔐 Security Considerations

The application includes protected routes to prevent unauthenticated access to the main application.

Security-related practices include:

* Protected frontend routes
* Authentication flow
* Environment-based configuration
* `.gitignore` protection for local configuration
* Separation of frontend and backend services

For production use, authentication and authorization should be strengthened with industry-standard mechanisms such as secure password hashing, token-based authentication, HTTPS and proper session management.

---

# 🧪 Example User Journey

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Upload Business Document
   ↓
Analyze Document
   ↓
Receive Compliance Score
   ↓
Review Risk Level
   ↓
Inspect Findings
   ↓
Read Recommendations
   ↓
View Report
   ↓
Download PDF
   ↓
Track in Compliance History
```

---

# 🔮 Future Roadmap

The project can be extended with:

* 🤖 AI-powered regulatory knowledge integration
* 📚 Regulatory knowledge base
* 🌐 Support for additional document formats
* 📈 Advanced compliance analytics
* ⏰ Regulatory deadline reminders
* 📧 Email notifications
* 🏢 Multi-business management
* 👥 Role-based access control
* ☁️ Cloud database integration
* 🔑 Production-grade authentication
* 📡 Deployment monitoring
* 🧾 Automated compliance checklist generation

---

# 🎓 Project Purpose

AI Compliance Copilot was developed as a **full-stack academic and project demonstration application** focused on improving the way MSMEs approach document-based compliance management.

The project combines:

**Frontend Development + Backend APIs + Database Management + Document Processing + Compliance Analysis**

into a single web application.

---

# 👩‍💻 Author

**Lavanya S**

**B.Tech — Computer Science and Business Systems**

---

# 🔗 Project Repository

GitHub:

https://github.com/lavanya-62/AI-Compliance-Copilot

---

# 📜 License

This project is developed for **educational and project demonstration purposes**.

Compliance results generated by the application should not be treated as legal advice. Businesses should verify applicable requirements with the relevant authorities or qualified professionals.

