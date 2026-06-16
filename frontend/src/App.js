import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./components/landing/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";

// Document Verification (NEW)
import DocumentVerificationPage from "./components/DocumentVerificationPage";

// Volunteer
import VolunteerLayout from "./components/volunteer/VolunteerLayout";
import VolunteerDashboard from "./components/volunteer/VolunteerDashboard";
import AvailableEvents from "./components/volunteer/AvailableEvents";
import MyEvents from "./components/volunteer/MyEvents";
import VolunteerHistory from "./components/volunteer/VolunteerHistory";
import VolunteerCertificates from "./components/volunteer/VolunteerCertificates";
import VolunteerProfile from "./components/volunteer/VolunteerProfile";
import VolunteerHelp from "./components/volunteer/VolunteerHelp";

// Organizer
import OrganizerLayout from "./components/organizer/OrganizerLayout";
import OrganizerDashboard from "./components/organizer/OrganizerDashboard";
import CreateEvent from "./components/organizer/CreateEvent";
import OrganizerMyEvents from "./components/organizer/OrganizerMyEvents";
import OrganizerVolunteers from "./components/organizer/OrganizerVolunteers";
import OrganizerAttendance from "./components/organizer/OrganizerAttendance";
import OrganizerReports from "./components/organizer/OrganizerReports";
import EditEvent from "./components/organizer/EditEvent";
import OrganizerHelp from "./components/organizer/OrganizerHelp";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminComplaints from "./components/admin/AdminComplaints"; 
import AdminDocumentVerification from "./components/admin/AdminDocumentVerification";


// ChatBot
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Document Verification (NEW) */}
        <Route
          path="/document-verification"
          element={<DocumentVerificationPage />}
        />

        {/* Volunteer Routes */}
        <Route path="/volunteer" element={<VolunteerLayout />}>
          <Route index element={<VolunteerDashboard />} />
          <Route path="available-events" element={<AvailableEvents />} />
          <Route path="my-events" element={<MyEvents />} />
          <Route path="history" element={<VolunteerHistory />} />
          <Route
            path="/volunteer/certificates"
            element={<VolunteerCertificates />}
          />
          <Route path="profile" element={<VolunteerProfile />} />
          <Route path="help" element={<VolunteerHelp />} />
        </Route>

        {/* Organizer Routes */}
        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route index element={<OrganizerDashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="my-events" element={<OrganizerMyEvents />} />
          <Route path="volunteer" element={<OrganizerVolunteers />} />
          <Route path="attendance" element={<OrganizerAttendance />} />
          <Route path="reports" element={<OrganizerReports />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
          <Route path="help" element={<OrganizerHelp />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="document-verification" element={<AdminDocumentVerification />}
/>

        </Route>
      </Routes>

      {/* ChatBot (global floating chatbot) */}
      <ChatBot />
    </BrowserRouter>
  );
}

export default App;
