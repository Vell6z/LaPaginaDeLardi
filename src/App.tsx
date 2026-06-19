import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Home } from "./pages/Home";
import { FAQPage } from "./pages/FAQPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import { RecoverPage } from "./pages/RecoverPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { ActiveRecallPage } from "./pages/ActiveRecallPage";
import { ArchivePage } from "./pages/ArchivePage";
import { SubjectDetailPage } from "./pages/SubjectDetailPage";
import { ClassDetailPage } from "./pages/ClassDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoadingScreen } from "./components/LoadingScreen";
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
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recover" element={<RecoverPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/materias" element={<SubjectsPage />} />
          <Route path="/materias/:id" element={<SubjectDetailPage />} />
          <Route path="/materias/:id/clase/:claseId" element={<ClassDetailPage />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/repaso" element={<ActiveRecallPage />} />
          <Route path="/archivo" element={<ArchivePage />} />
          <Route path="/ajustes" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
