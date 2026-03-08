import { Rocket, ExternalLink } from "lucide-react";

const VenturesSection = () => {
  return (
    <section id="ventures" className="px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Rocket className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Ventures</h2>
        </div>
        <div className="p-8 rounded-lg bg-card border border-border">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-2">Founder · Product Manager</p>
              <h3 className="font-display text-2xl md:text-3xl text-foreground">Womanie</h3>
            </div>
            <a
              href="https://womanie.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-accent hover:text-foreground transition-colors font-body text-sm mt-1"
            >
              Visit <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="font-body text-muted-foreground leading-relaxed mb-4">
            After going through my own fertility challenges, I decided to do something about the broken women's health experience. That's how Womanie was born. As CEO and product director, I lead the vision and strategy — and vibe-code much of the platform myself. Womanie is your complete women's health companion — an AI-powered platform offering personalised cycle tracking, symptom logging, telehealth consultations, and secure medical document management. Designed to support every stage of the reproductive journey, from first period through menopause.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {["AI Health Assistant", "Telehealth", "Cycle Tracking", "HIPAA Compliant", "Wearable Integration"].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-body tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenturesSection;
