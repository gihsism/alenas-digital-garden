import { Rocket, ExternalLink, Code, Github } from "lucide-react";

const sideProjects = [
  {
    name: "StudiesCheck",
    url: "https://studiescheck.com/",
    github: "https://github.com/gihsism/mtec-tracker",
    description: "A degree planning and progress tracker for MAS MTEC students at ETH Zurich. I designed, built, and shipped it end-to-end — and fellow students now use it to navigate degree requirements, track ECTS credits, and plan their academic path.",
  },
  {
    name: "Accounting for AI Software",
    github: "https://github.com/gihsism/accountingforaisoftwarev2",
    description: "A personal exploration of how to account for AI-generated software and digital assets under IFRS and US GAAP — combining my accounting background with AI. The thinking later informed my technical work at KPMG.",
  },
  {
    name: "Autonomous Agent (AI Market Radar)",
    github: "https://github.com/gihsism/job-monitor-agent",
    description: "A hands-on sandbox for building production-style AI agents — autonomous scraping, LLM-based ranking, scheduling, and personalised digests. My way of learning how to design and ship agentic workflows end-to-end.",
  },
  {
    name: "IFRS 18 Conversion Tool",
    url: "/IFRS18analysis",
    github: "https://github.com/gihsism/ifrs18tool",
    description: "An AI tool I designed and built to analyse financial statements for IFRS 18 impact — generating compliant P&L, balance sheet, and cash flow presentations with aggregation analysis, MPM disclosures, and transition reconciliation. Where finance expertise meets product building.",
  },
  {
    name: "Disclosure Checklist",
    url: "/disclosurechecklistIFRS",
    github: "https://github.com/gihsism/disclosure-checklist",
    description: "An AI-powered IFRS disclosure compliance analyser — built to take the pain out of the checklist work every reporting team dreads. A small product experiment in applying AI to real accounting workflows.",
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
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Passion Project</h2>
        </div>

        <div className="p-8 rounded-lg bg-card border border-border mb-12">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">Product Owner · Personal Project</p>
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
            Womanie is a personal project I build in my free time — my way of growing as a product owner while exploring my own curiosity about women's health, sparked by navigating my own fertility journey. It's a non-commercial passion project where I own the product end-to-end: shaping the roadmap, designing the experience, and building it myself — from AI-assisted cycle tracking to symptom logging and a secure place to keep medical documents, spanning the reproductive journey from first period through menopause. It's where I sharpen my product and AI skills, hands-on, for the joy of building.
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
