import { GraduationCap } from "lucide-react";

const degrees = [
  {
    period: "In progress · expected Jun 2027",
    title: "MAS in Management, Technology & Economics",
    institution: "ETH Zurich",
    description:
      "Advanced training in management, technology, and economics to lead finance and product strategy in high-growth environments.",
  },
  {
    period: "Completed · 2024",
    title: "CAS in Artificial Intelligence and Software Development",
    institution: "ETH Zurich",
    description:
      "Applied AI and software development studies supporting product leadership in AI-driven ventures.",
  },
  {
    period: "Completed · 2016",
    title: "BSc in Finance",
    institution: "Higher School of Economics",
    description:
      "Formal finance education underpinning technical accounting, reporting, and strategic finance leadership.",
  },
  {
    period: "Completed · 2011",
    title: "MSc in Sociology",
    institution: "Lomonosov Moscow State University",
    description:
      "Strong analytical and systems-thinking foundation from social sciences.",
  },
];

const qualifications = [
  "Member of ACCA (Association of Chartered Certified Accountants), 2016",
  "Swiss Audit License, 2020",
  "Business Information Technology courses, ZHAW, 2022",
];

const EducationSection = () => {
  return (
    <section id="education" className="px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <GraduationCap className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Education & Qualifications</h2>
        </div>

        <div className="space-y-8">
          {degrees.map((degree, index) => (
            <div key={index} className="p-8 rounded-lg bg-card border border-border">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">{degree.period}</p>
              <h3 className="font-display text-xl text-foreground mb-2">{degree.title}</h3>
              <p className="font-body text-sm text-muted-foreground mb-4">{degree.institution}</p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{degree.description}</p>
            </div>
          ))}

          <div className="p-8 rounded-lg bg-card border border-border">
            <h3 className="font-display text-xl text-foreground mb-4">Professional Credentials</h3>
            <ul className="space-y-3">
              {qualifications.map((item) => (
                <li key={item} className="font-body text-sm text-muted-foreground leading-relaxed">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;

