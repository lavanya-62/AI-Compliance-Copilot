import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import History from "./pages/History";

import Layout from "./components/Layout";
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* =========================
            PROTECTED ROUTES
            User must be logged in
        ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<Layout />}>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/upload" element={<Upload />} />

            <Route path="/reports" element={<Reports />} />

            <Route path="/history" element={<History />} />


            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;