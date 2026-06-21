import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import { Home } from "../modules/landing/pages/Home";
import { FAQPage } from "../modules/landing/pages/FAQPage";
import { PrivacyPage } from "../modules/landing/pages/PrivacyPage";
import { SignUpPage } from "../modules/auth/pages/SignUpPage";
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { RecoverPage } from "../modules/auth/pages/RecoverPage";
import { DashboardPage } from "../modules/dashboard/pages/DashboardPage";
import { SubjectsPage } from "../modules/subjects/pages/SubjectsPage";
import { CalendarPage } from "../modules/calendar/pages/CalendarPage";
import { ActiveRecallPage } from "../modules/study/pages/ActiveRecallPage";
import { SubjectDetailPage } from "../modules/subjects/pages/SubjectDetailPage";
import { ClassDetailPage } from "../modules/subjects/pages/ClassDetailPage";
import { SettingsPage } from "../modules/settings/SettingsPage";
import { ProtectedRoute } from "../modules/auth/components/ProtectedRoute";
import { MobileRecordPage } from "../modules/subjects/pages/MobileRecordPage";
import { LoadingScreen } from "../shared/ui/LoadingScreen";
import { AnimatePresence } from "motion/react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recover" element={<RecoverPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/materias" element={<SubjectsPage />} />
            <Route path="/materias/:id" element={<SubjectDetailPage />} />
            <Route path="/materias/:id/clase/:claseId" element={<ClassDetailPage />} />
            <Route path="/mobile-record/:id/:claseId" element={<MobileRecordPage />} />
            <Route path="/calendario" element={<CalendarPage />} />
            <Route path="/repaso" element={<ActiveRecallPage />} />
            <Route path="/ajustes" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
