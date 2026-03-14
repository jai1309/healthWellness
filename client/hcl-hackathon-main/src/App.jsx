import { Navigate, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import Profile from "./pages/Profile";
import GoalTracker from "./pages/GoalTracker";
import PublicHealthInfo from "./pages/PublicHealthInfo";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/health-topics" element={<PublicHealthInfo />} />

      {/* PATIENT DASHBOARD */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* PROVIDER DASHBOARD */}
      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute allowedRoles={["provider"]}>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />

      {/* PATIENT FEATURES */}
      <Route
        path="/goal-tracker"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <GoalTracker />
          </ProtectedRoute>
        }
      />

      {/* SHARED FEATURES */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["patient", "provider"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;