import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CareerSection from "@/components/CareerSection";
import VenturesSection from "@/components/VenturesSection";
import EducationSection from "@/components/EducationSection";
import AdvocacySection from "@/components/AdvocacySection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="bg-background font-body min-h-screen">
      <HeroSection />
      <CareerSection />
      <VenturesSection />
      <EducationSection />
      <AdvocacySection />
      <ContactSection />
      <footer className="py-8 text-center font-body text-xs text-muted-foreground tracking-wider">
        © {new Date().getFullYear()} Alena Buckley. All rights reserved.
      </footer>
    </main>
  );
};

export default Index;
