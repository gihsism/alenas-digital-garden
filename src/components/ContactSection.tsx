import { Linkedin, MapPin, Github } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">Get in Touch</h2>
        <div className="flex items-center justify-center gap-2 text-muted-foreground font-body mb-8">
          <MapPin className="w-4 h-4 text-accent" />
          <span>Zurich, Switzerland</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.linkedin.com/in/alena-n-80966153/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-body text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
          <a
            href="https://github.com/gihsism"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-body text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
