import { Briefcase } from "lucide-react";

const roles = [
  {
    title: "Senior Manager, Technical Accounting Advisory",
    company: "KPMG AG",
    location: "Zurich, Switzerland",
    period: "Apr 2025 – Present",
    description:
      "Leading technical accounting advisory across IFRS and US GAAP for complex transactions, CFO-level decision support, and AI-driven accounting knowledge initiatives.",
  },
  {
    title: "Founder & CEO",
    company: "Womanie",
    location: "Zurich, Switzerland",
    period: "Present",
    description:
      "Building an AI-powered women’s health platform spanning product strategy, operations, and go-to-market across health, technology, and impact.",
  },
  {
    title: "Consolidation and Reporting Manager (Technical Accounting Expert)",
    company: "Hitachi Energy",
    location: "Zurich, Switzerland",
    period: "May 2020 – Mar 2025",
    description:
      "Led global US GAAP-to-IFRS conversion across 120+ entities in 62 countries, technical accounting policy design, and finance transformation initiatives including S/4HANA and Tagetik.",
  },
  {
    title: "Manager → Assistant Manager, External Audit",
    company: "KPMG AG",
    location: "Zurich, Switzerland",
    period: "Feb 2018 – May 2020",
    description:
      "Managed and delivered 100+ external audits for listed and non-listed clients across US GAAP, IFRS, and SOX environments, including large multinational group audits.",
  },
  {
    title: "Assistant Manager, External Audit",
    company: "KPMG LLP",
    location: "Bristol, United Kingdom",
    period: "Aug 2016 – Feb 2018",
    description:
      "Led multiple engagements in parallel as overall in-charge, improving audit quality and strengthening project delivery in complex reporting contexts.",
  },
  {
    title: "Auditor → Senior Auditor, External Audit",
    company: "KPMG CJSC",
    location: "Moscow, Russia",
    period: "Sep 2012 – Aug 2016",
    description:
      "Delivered statutory and IFRS group audits across energy, natural resources, mining, pharma, and industrial sectors, building a strong foundation in technical reporting.",
  },
];

const CareerSection = () => {
  return (
    <section id="career" className="px-6 py-24 bg-card">
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

