import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const STREAMLIT_URL =
  import.meta.env.VITE_IFRS18_STREAMLIT_URL ||
  "https://gihsism-ifrs18tool-app-lcitfr.streamlit.app";

export default function IFRS18Analysis() {
  useEffect(() => {
    document.title = "IFRS 18 Analysis Tool";
  }, []);

  const src = `${STREAMLIT_URL}/?embed=true&embed_options=light_theme,show_padding`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Back
          </a>
          <h1 className="text-lg font-semibold">IFRS 18 Conversion Tool</h1>
        </div>
      </header>

      <iframe
        title="IFRS 18 Conversion Tool"
        src={src}
        className="flex-1 w-full border-0"
        allow="clipboard-read; clipboard-write; fullscreen"
      />
    </div>
  );
}
