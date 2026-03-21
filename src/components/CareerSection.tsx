import { Briefcase } from "lucide-react";

const roles = [
  {
    title: "Founder & CEO",
    company: "Womanie",
    location: "Zurich, Switzerland",
    period: "Present",
    description:
      "Building an AI-powered women's health platform spanning product strategy, operations, and go-to-market across health, technology, and impact.",
  },
  {
    title: "Senior Manager, Technical Accounting Advisory Services",
    company: "KPMG AG",
    location: "Zurich, Switzerland",
    period: "Apr 2025 – Present",
    description:
      "Leading client engagements across GAAP conversions, IPO readiness, and M&A accounting. Driving strategic financial advisory with CFO-level scope — from regulatory compliance to business transformation.",
  },
  {
    title: "Technical Accounting Manager & AI Product Owner",
    company: "Hitachi Energy",
    location: "Zurich, Switzerland",
    period: "May 2020 – Mar 2025",
    description:
      "Led global US GAAP-to-IFRS conversion across 120+ entities in 62 countries. Interpreted complex transactions, managed financial reporting and controlling. Pioneered the development of an internal AI accounting chatbot as Lead SME and functional owner. Drove finance transformation initiatives including S/4HANA and Tagetik implementations, and delivered 40+ webinars training 300+ controllers globally.",
  },
  {
    title: "Auditor → Senior Auditor → Junior Manager, External Audit",
    company: "KPMG (Moscow → Bristol → Zurich)",
    location: "Russia · UK · Switzerland",
    period: "Sep 2012 – May 2020",
    description:
      "Eight years across three KPMG offices and countries, progressing from auditor to manager. Delivered 100+ external audits across US GAAP, IFRS, and SOX for clients in energy, natural resources, pharma, technology, and industrial sectors. Designed SOX compliance audit program for ABB, coordinated 80+ component audit teams, and managed up to 9 concurrent engagements. Completed ACCA and Swiss Audit License qualifications.",
  },
];

const CareerSection = () => {
  return (
    <section id="career" className="px-6 pt-12 pb-24 bg-card">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Briefcase className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Professional Career</h2>
        </div>
        <div className="space-y-12">
          {roles.map((role, i) => (
            <div key={i} className="border-l-2 border-accent pl-8 relative">
              <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-accent" />
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">
                {role.period} · {role.location}
              </p>
              <h3 className="font-display text-xl md:text-2xl text-foreground mb-1">{role.title}</h3>
              <p className="font-body text-sm font-medium text-muted-foreground mb-3">{role.company}</p>
              <p className="font-body text-muted-foreground leading-relaxed">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerSection;

