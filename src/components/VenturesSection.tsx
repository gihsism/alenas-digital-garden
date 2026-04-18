import { Rocket, ExternalLink, Code, Github } from "lucide-react";

const sideProjects = [
  {
    name: "StudiesCheck",
    url: "https://studiescheck.com/",
    github: "https://github.com/gihsism/mtec-tracker",
    description: "A degree planning and progress tracking tool for MAS MTEC students at ETH Zurich. Simplifies navigating complex degree requirements, tracking ECTS credits, and planning your academic path.",
  },
  {
    name: "Accounting for AI Software",
    github: "https://github.com/gihsism/accountingforaisoftwarev2",
    description: "Started as a side project exploring the accounting implications of AI-generated software and digital assets — then implemented it at KPMG.",
  },
  {
    name: "Job Monitor Agent",
    github: "https://github.com/gihsism/job-monitor-agent",
    description: "An AI-powered agent that monitors job listings and sends personalised alerts.",
  },
  {
    name: "IFRS 18 Conversion Tool",
    url: "/IFRS18analysis",
    github: "https://github.com/gihsism/ifrs18tool",
    description: "Analyses financial statements for IFRS 18 impact and generates compliant P&L, balance sheet, and cash flow presentations with aggregation analysis, MPM disclosures, and transition reconciliation.",
  },
  {
    name: "Disclosure Checklist",
    url: "/disclosurechecklistIFRS",
    github: "https://github.com/gihsism/disclosure-checklist",
    description: "AI-powered IFRS disclosure compliance analyzer for financial statements.",
  },
  {
    name: "GenAI Zurich 2026 Schedule",
    url: "https://alenanikolskaia.com/gaz26_schedule.html",
    description: "Interactive schedule for the GenAI Zurich 2026 conference.",
  },
];

const VenturesSection = () => {
  return (
    <section id="ventures" className="px-6 py-24">
      <div className="max-w-3xl mx-auto">
        {/* Startup */}
        <div className="flex items-center gap-3 mb-12">
          <Rocket className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Startup</h2>
        </div>

        <div className="p-8 rounded-lg bg-card border border-border mb-12">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">Founder · Product Owner</p>
              <h3 className="font-display text-2xl md:text-3xl text-foreground">Womanie</h3>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://womanie.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-accent hover:text-foreground transition-colors font-body text-sm"
              >
                Visit <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/gihsism/womanie-bloom-care"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          <p className="font-body text-muted-foreground leading-relaxed mb-4">
            After going through my own fertility challenges, I decided to do something about the broken women's health experience. That's how Womanie was born. As CEO and product director, I lead the vision and strategy — and stay deeply hands-on, building much of the platform myself. Womanie is your complete women's health companion — an AI-powered platform offering personalised cycle tracking, symptom logging, telehealth consultations, and secure medical document management. Designed to support every stage of the reproductive journey, from first period through menopause.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {["AI Health Assistant", "Telehealth", "Cycle Tracking", "HIPAA Compliant", "Wearable Integration"].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-body tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Side Projects */}
        <div id="side-projects" className="flex items-center gap-3 mb-8 scroll-mt-24">
          <Code className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Side Projects</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sideProjects.map((project) => (
            <div key={project.name} className="p-6 rounded-lg bg-card border border-border">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-display text-lg text-foreground">{project.name}</h4>
                <div className="flex items-center gap-2 shrink-0">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-foreground transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VenturesSection;
