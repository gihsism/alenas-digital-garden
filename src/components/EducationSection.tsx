import { GraduationCap } from "lucide-react";

const EducationSection = () => {
  return (
    <section id="education" className="px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <GraduationCap className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Education</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-lg bg-card border border-border">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">Current</p>
            <h3 className="font-display text-xl text-foreground mb-2">
              MAS in Management, Technology & Economics
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-4">ETH Zurich — MTEC Programme</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Blending management expertise with technology and economics at one of the world's leading technical universities.
            </p>
          </div>
          <div className="p-8 rounded-lg bg-card border border-border">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">Completed</p>
            <h3 className="font-display text-xl text-foreground mb-2">
              MSc in Sociology
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-4">Lomonosov Moscow State University</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Foundation in social sciences and analytical thinking from Russia's most prestigious university.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
