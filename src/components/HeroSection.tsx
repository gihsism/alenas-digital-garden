const HeroSection = () => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 pt-24 pb-12">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 animate-fade-up">
          Personal website of
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-foreground leading-[1.1] mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Alena Nikolskaia
        </h1>
        <div className="w-16 h-px bg-accent mx-auto my-8 animate-fade-up" style={{ animationDelay: '0.3s' }} />
        <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
          Finance & Accounting · AI Products · Founder
        </p>
        <nav className="mt-12 flex flex-wrap justify-center gap-8 font-body text-sm tracking-wider uppercase animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <a href="#career" className="text-muted-foreground hover:text-accent transition-colors duration-300">Career</a>
          <a href="#ventures" className="text-muted-foreground hover:text-accent transition-colors duration-300">Startup</a>
          <a href="#side-projects" className="text-muted-foreground hover:text-accent transition-colors duration-300">Side Projects</a>
          <a href="#education" className="text-muted-foreground hover:text-accent transition-colors duration-300">Education</a>
          <a href="#advocacy" className="text-muted-foreground hover:text-accent transition-colors duration-300">Advocacy</a>
          <a href="#contact" className="text-muted-foreground hover:text-accent transition-colors duration-300">Contact</a>
        </nav>
      </div>
    </section>
  );
};

export default HeroSection;
