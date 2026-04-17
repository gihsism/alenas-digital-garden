import { useEffect } from "react";

const APP_URL = "https://disclosure-checklist.vercel.app";

const IFRSdisclosurechecklist = () => {
  useEffect(() => {
    document.title = "IFRS Disclosure Checklist — Alena Nikolskaia";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
              IFRS Disclosure Checklist
            </h1>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Automated disclosure compliance review
          </span>
        </div>
      </header>

      <main className="flex-1">
        <iframe
          src={APP_URL}
          title="IFRS Disclosure Checklist"
          className="w-full h-[calc(100vh-57px)] border-0"
          allow="clipboard-read; clipboard-write"
          loading="lazy"
        />
      </main>
    </div>
  );
};

export default IFRSdisclosurechecklist;
