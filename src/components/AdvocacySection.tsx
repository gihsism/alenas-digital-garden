import { Heart } from "lucide-react";

const AdvocacySection = () => {
  return (
    <section id="advocacy" className="px-6 py-24 bg-card">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Heart className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Civic Engagement</h2>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-xl text-foreground mb-4">Verein Russland der Zukunft</h3>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              Co-organizer of Russia of the Future — a Swiss association established in early 2022 to give voice to Russian expatriates opposing the war in Ukraine and Putin's regime. The organization amplifies anti-war voices from the Russian diaspora, speaking for those silenced by repression at home.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              Key events include the May 2022 Zurich rally under the motto <span className="font-display italic text-foreground">"I am Russian and I am against the war"</span> and demonstrations in Bern calling for stronger international sanctions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvocacySection;
