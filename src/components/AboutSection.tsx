import { User } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="px-6 pt-12 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <User className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground">About Me</h2>
        </div>
        <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
          <p>
            I'm Alena Nikolskaia — a finance executive, AI product leader, and founder based in Zurich, Switzerland. My career has taken me across three countries and some of the most complex challenges in global accounting, and along the way I discovered a deep passion for building things that sit at the intersection of finance, technology, and social change.
          </p>
          <p>
            Currently, I'm a Senior Manager at{" "}
            <a href="https://kpmg.com/ch/en.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4 font-medium">KPMG Switzerland</a>, working in{" "}
            <a href="https://kpmg.com/ch/en/services/audit/accounting-advisory-corporates.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">Accounting Advisory Services</a>
            . I advise corporates at CFO and board level on their most complex financial reporting challenges — GAAP conversions, IPO readiness, M&A accounting, and new standards like IFRS 18. From assessing complex transactions to standing up entire finance functions, my work covers the full scope of strategic finance leadership.
          </p>
          <p>
            Before KPMG, I spent five years at{" "}
            <a href="https://www.hitachienergy.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4 font-medium">Hitachi Energy</a>, where I led a global US GAAP-to-IFRS conversion across 120+ entities in 62 countries, drove finance transformation initiatives including S/4HANA and Tagetik implementations, and delivered 40+ webinars training 300+ controllers worldwide. Driven by my passion for product thinking and AI, I also pioneered the development of an internal AI accounting chatbot there.
          </p>
          <p>
            After going through my own fertility challenges, I decided to do something about the broken women's health experience. That's how{" "}
            <a href="https://womanie.info/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">
              Womanie
            </a>
            {" "}was born. As CEO and product director, I lead the vision and strategy — and vibe-code much of the platform myself, from AI-powered cycle tracking to secure medical document management.
          </p>
          <p>
            I grew up in Russia during the turbulent 1990s and early 2000s — a period of deep economic instability and uncertainty that shaped my resilience and drive from an early age. As times changed and economies shifted, I didn't just adapt — I chose to go deeper. From chemistry at high school (nine hours a week of it), to sociology and then finance at university, to working in PR and product management during my university years, to building a career in external financial audit across multiple countries, and most recently into machine learning and AI — I sought out each new field, dove in, and made it my own.
          </p>
          <p>
            I trained as an auditor at KPMG Moscow, then moved to Bristol and eventually Zurich — earning my ACCA qualification and Swiss Audit License along the way. I hold a BSc in Finance from the Higher School of Economics and an MSc in Sociology from Lomonosov Moscow State University. In 2024, I completed a{" "}
            <a href="https://inf.ethz.ch/continuing-education/CAS-AIS.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">CAS in Artificial Intelligence and Software Development</a> at ETH Zurich, and I'm currently pursuing an{" "}
            <a href="https://mas-mtec.ethz.ch/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">MAS in Management, Technology & Economics (MTEC)</a> there — expected to finish in 2027.
          </p>
          <p>
            On a personal note — I'm happily engaged to{" "}
            <a href="https://maxbuckley.ai" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">
              Max Buckley
            </a>
            , my biggest supporter and favourite person to brainstorm with. He's an AI researcher here in Zurich — we actually met at an AI meetup, and since then we've been travelling all over the world together to the best ML conferences, from{" "}
            <a href="https://neurips.cc/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">NeurIPS</a> to{" "}
            <a href="https://www.oxfordml.school/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">OXML</a> to{" "}
            <a href="https://2026.appliedmldays.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">AMLD</a> and beyond. We share a love for building things and exploring ideas, and I honestly can't imagine doing any of this without him.
          </p>
          <p>
            I'm passionate about civic engagement — I co-founded{" "}
            <a href="https://www.futurerussia.ch/en" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-foreground transition-colors underline underline-offset-4">Future Russia CH</a>, a Swiss association amplifying anti-war voices from the Russian diaspora. I'm always interested in conversations about how technology can drive meaningful change.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
