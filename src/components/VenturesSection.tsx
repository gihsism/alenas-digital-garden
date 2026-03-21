import { Rocket, ExternalLink, GraduationCap, Code } from "lucide-react";

const ventures = [
  {
    role: "Founder · Product Manager",
    name: "Womanie",
    url: "https://womanie.info/",
    description:
      "After going through my own fertility challenges, I decided to do something about the broken women's health experience. That's how Womanie was born. As CEO and product director, I lead the vision and strategy — and stay deeply hands-on, building much of the platform myself. Womanie is your complete women's health companion — an AI-powered platform offering personalised cycle tracking, symptom logging, telehealth consultations, and secure medical document management. Designed to support every stage of the reproductive journey, from first period through menopause.",
    tags: ["AI Health Assistant", "Telehealth", "Cycle Tracking", "HIPAA Compliant", "Wearable Integration"],
  },
  {
    role: "Creator",
    name: "StudiesCheck",
    url: "https://studiescheck.com/",
    description:
      "A degree planning and progress tracking tool for ETH Zurich students. Built to simplify navigating complex degree requirements, tracking ECTS credits, and planning your academic path — all in one clean interface.",
    tags: ["ETH Zurich", "Academic Planning", "ECTS Tracking", "React", "TypeScript"],
  },
];

const sideProjects = [
  {
    name: "Accounting for AI Software",
    url: "https://github.com/gihsism/accountingforaisoftwarev2",
    description: "Exploring the accounting implications of AI-generated software and digital assets.",
  },
  {
    name: "Job Monitor Agent",
    url: "https://github.com/gihsism/job-monitor-agent",
    description: "An AI-powered agent that monitors job listings and sends personalised alerts.",
  },
];

const VenturesSection = () => {
  return (
    <section id="ventures" className="px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Rocket className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Ventures</h2>
        </div>

        <div className="space-y-6">
          {ventures.map((venture) => (
            <div key={venture.name} className="p-8 rounded-lg bg-card border border-border">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">{venture.role}</p>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">{venture.name}</h3>
                </div>
                <a
                  href={venture.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-accent hover:text-foreground transition-colors font-body text-sm mt-1"
                >
                  Visit <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="font-body text-muted-foreground leading-relaxed mb-4">
                {venture.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {venture.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-body tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Side Projects */}
          <div className="pt-6">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-4 h-4 text-accent" />
              <h3 className="font-display text-xl md:text-2xl text-foreground">Side Projects</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {sideProjects.map((project) => (
                <div key={project.name} className="p-6 rounded-lg bg-card border border-border">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-display text-lg text-foreground">{project.name}</h4>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-foreground transition-colors shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenturesSection;
