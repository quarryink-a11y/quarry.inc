import { Footer } from "react-day-picker";

import { ArtistsSection } from "@/components/home/ArtistsSection";
import { CTASection } from "@/components/home/CTASection";
import { DesignsSection } from "@/components/home/DesignsSection";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Navbar } from "@/components/home/Navbar";
import { ProductOverview } from "@/components/home/ProductOverview";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111113] overflow-x-hidden">
      <Navbar />
      <Hero />
      <ArtistsSection />
      <ProductOverview />
      <HowItWorks />
      <DesignsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
