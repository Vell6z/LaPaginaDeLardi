import { Navbar } from "../../../shared/layout/Navbar";
import { PrivacySection } from "../components/PrivacySection";
import { Footer } from "../../../shared/layout/Footer";
import { useEffect } from "react";

export function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#112613] text-[#F9F6F0] font-body flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center">
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
}
