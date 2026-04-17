import { useEffect } from "react";

const STREAMLIT_URL = "https://ifrs18tool.streamlit.app";

const IFRS18Analysis = () => {
  useEffect(() => {
    document.title = "IFRS 18 Analysis Tool — Alena Nikolskaia";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header bar */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Back to alenanikolskaia.com
            </a>
            <span className="text-muted-foreground/30">|</span>
            <h1 className="text-lg font-semibold text-foreground">
              IFRS 18 Conversion Tool
            </h1>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Presentation and Disclosure in Financial Statements
          </span>
        </div>
      </header>

      {/* Streamlit iframe */}
      <main className="flex-1">
        <iframe
          src={STREAMLIT_URL}
          title="IFRS 18 Analysis Tool"
          className="w-full h-[calc(100vh-57px)] border-0"
          allow="clipboard-read; clipboard-write"
          loading="lazy"
        />
      </main>
    </div>
  );
};

export default IFRS18Analysis;
