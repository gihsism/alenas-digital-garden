import { User } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <User className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">About Me</h2>
        </div>
        <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
          <p>
            I'm Alena Buckley — a finance executive, AI product leader, and founder based in Zurich, Switzerland. My career has taken me across three countries and some of the most complex challenges in global accounting, and along the way I discovered a deep passion for building things that sit at the intersection of finance, technology, and impact.
          </p>
          <p>
            Currently, I'm a Senior Manager at{" "}
            <a href="https://kpmg.com/ch/en.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4 font-medium">KPMG Switzerland</a>, working in{" "}
            <a href="https://kpmg.com/ch/en/services/audit/accounting-advisory-corporates.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">Accounting Advisory Services</a>{" "}
            and leading engagements across GAAP conversions, IPO readiness, and M&A accounting. Before that, I spent five years at{" "}
            <a href="https://www.hitachienergy.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4 font-medium">Hitachi Energy</a>, where I led a global US GAAP-to-IFRS conversion across 120+ entities and pioneered the development of an internal AI accounting chatbot — a project that sparked my shift into product thinking and AI.
          </p>
          <p>
            That spark became{" "}
            <a href="https://womanie.info/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">
              Womanie
            </a>
            , the company I founded to build an AI-powered women's health platform. It's where I pour my energy outside of work — designing products that help women navigate their health with better tools, better data, and better care.
          </p>
          <p>
            I grew up in Russia, trained as an auditor at KPMG Moscow, then moved to Bristol and eventually Zurich — earning my ACCA qualification and Swiss Audit License along the way. I hold a BSc in Finance from the Higher School of Economics and an MSc in Sociology from Lomonosov Moscow State University. More recently, I completed a CAS in Artificial Intelligence and Software Development at ETH Zurich, and I'm currently pursuing an MAS in Management, Technology & Economics (MTEC) there — expected to finish in 2027.
          </p>
          <p>
            On a personal note — I'm happily married to{" "}
            <a href="https://maxbuckley.ai" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">
              Max
            </a>
            , my biggest supporter and favourite person to brainstorm with. He's an AI researcher here in Zurich — we actually met at an AI meetup, and since then we've been travelling all over the world together to the best ML conferences, from{" "}
            <a href="https://neurips.cc/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">NeurIPS</a> to{" "}
            <a href="https://www.oxfordml.school/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">OXML</a> to{" "}
            <a href="https://2026.appliedmldays.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">AMLD</a> and beyond. We share a love for building things and exploring ideas, and I honestly can't imagine doing any of this without him.
          </p>
          <p>
            I'm passionate about civic engagement — I co-organize{" "}
            <span className="text-foreground italic">Russia of the Future</span>, a Swiss association amplifying anti-war voices from the Russian diaspora. I'm always interested in conversations about how technology can drive meaningful change.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
