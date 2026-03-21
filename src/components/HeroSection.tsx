const HeroSection = () => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 pt-24 pb-12">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 animate-fade-up">
          Finance · Product · AI · Advocacy
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-foreground leading-[1.1] mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Alena Nikolskaia
        </h1>
        <div className="w-16 h-px bg-accent mx-auto my-8 animate-fade-up" style={{ animationDelay: '0.3s' }} />
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.4s' }}>
          Finance advisor, AI product builder, and founder — building at the intersection of finance, technology, health, and civic impact from Zurich.
        </p>
        <nav className="mt-12 flex flex-wrap justify-center gap-8 font-body text-sm tracking-wider uppercase animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <a href="#career" className="text-muted-foreground hover:text-accent transition-colors duration-300">Career</a>
          <a href="#ventures" className="text-muted-foreground hover:text-accent transition-colors duration-300">Ventures</a>
          <a href="#education" className="text-muted-foreground hover:text-accent transition-colors duration-300">Education</a>
          <a href="#advocacy" className="text-muted-foreground hover:text-accent transition-colors duration-300">Advocacy</a>
          <a href="#contact" className="text-muted-foreground hover:text-accent transition-colors duration-300">Contact</a>
        </nav>
      </div>
    </section>
  );
};

export default HeroSection;
