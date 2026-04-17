import { useEffect } from "react";

const APP_URL = "https://disclosure-checklist.vercel.app";

const IFRSdisclosurechecklist = () => {
  useEffect(() => {
    window.location.href = APP_URL;
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">
        Redirecting to Disclosure Checklist...
      </p>
    </div>
  );
};

export default IFRSdisclosurechecklist;
