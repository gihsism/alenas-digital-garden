import { Briefcase } from "lucide-react";

const roles = [
  {
    title: "Senior Manager, Accounting Advisory Services",
    company: "KPMG Switzerland",
    location: "Zurich",
    period: "Present",
    description:
      "Supporting clients with accounting and financial reporting advice across audit and non-audit engagements. Specialising in GAAP conversions, IPO readiness, and M&A accounting implications within a dynamic regulatory environment.",
  },
  {
    title: "Reporting & Consolidation Manager",
    company: "Hitachi Energy (formerly Hitachi ABB Power Grids)",
    location: "Zurich",
    period: "Previous",
    description:
      "Oversaw financial reporting and consolidation processes across power grids and energy technology operations.",
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
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">{role.period} · {role.location}</p>
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
