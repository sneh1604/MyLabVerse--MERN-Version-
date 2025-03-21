import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RegisteredUsers from './components/RegisteredUsers';
import TestList from "./components/TestList";
import MakeReport from "./components/MakeReport";
import ViewReport from "./components/ViewReport";
import LogoutButton from "./components/Logout";
import Reports from "./components/reports";
import Graph from "./components/Graph";
import LipidReport from "./components/LipidReport";
import BloodSugarReport from "./components/BloodSugarReport";
import UserDashboard from "./components/UserDashboard";
import HemogramReport from "./components/Hemogram";
import LipidPdf from "./components/LipidPdf";
import HemogramReportPdf from "./components/HemogramReportPdf";
import BloodSugarPdf from "./components/BloodSugarReportPdf";
import ProfileForm from "./components/ProfileForm";
import PrescriptionOCR from "./components/PrescriptionOCR";
import AdministratorLogin from "./components/AdministratorLogin";
import AdministratorDashboard from "./components/AdministratorDashboard";
import AdministratorRegister from "./components/AdministratorRegister";
import InitialAdminSetup from "./components/InitialAdminSetup";
import SingleHemogramReport from "./components/SingleHemogramReport"; // You'll need to create this component
import BulkUpload from './components/BulkUpload';

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registered-users" element={<RegisteredUsers />} />
          <Route path="/test-list" element={<TestList />} />
          <Route path="/make-report" element={<MakeReport />} />
          <Route path="/viewreport" element={<ViewReport />} />
          <Route path="/logout" element={<LogoutButton />} /> 
          <Route path="/reports" element={<Reports />} />
          <Route path="/graph" element={<Graph/>} />
          <Route path="/lipid-profile" element={<LipidReport/>} />
          <Route path="/blood-sugar-report" element={<BloodSugarReport/>} />  
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/hemogram-reportpdf" element={<HemogramReportPdf />} />
          <Route path="/hemogram-report/:id" element={<SingleHemogramReport />} /> {/* Add this route for single hemogram report */}
          <Route path="/lipid-report" element={<LipidPdf />} />
          <Route path="/bloodsugar_reportpdf" element={<BloodSugarPdf />} />
          <Route path="/profile" element={<ProfileForm />} /> 
          <Route path="/prescriptionocr" element={<PrescriptionOCR />} />
          <Route path="/hemogram-report" element={<HemogramReport />} />
          <Route path="/bulk-upload" element={<BulkUpload />} />
          
          {/* Administrator routes */}
          <Route path="/administrator-login" element={<AdministratorLogin />} />
          <Route path="/administrator-dashboard" element={<AdministratorDashboard />} />
          <Route path="/administrator-register" element={<AdministratorRegister />} />
          <Route path="/initial-admin-setup" element={<InitialAdminSetup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
