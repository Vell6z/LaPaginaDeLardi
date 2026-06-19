import { Navbar } from "../../../shared/layout/Navbar";
import { FlashcardFAQ } from "../../study/components/FlashcardFAQ";
import { Footer } from "../../../shared/layout/Footer";
import { FAQSection } from "../components/FAQSection";
import { useEffect } from "react";

export function FAQPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cream-100 bg-grain text-acorn-600 font-body relative overflow-clip flex flex-col">
      <Navbar />
      <main className="flex-1">
        <FlashcardFAQ />
      </main>
      <Footer />
    </div>
  );
}
