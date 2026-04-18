const APP_URL = "https://disclosure-checklist.vercel.app";

const IFRSdisclosurechecklist = () => (
  <iframe
    src={APP_URL}
    title="IFRS Disclosure Checklist"
    className="block w-screen h-screen border-0"
    allow="clipboard-read; clipboard-write"
  />
);

export default IFRSdisclosurechecklist;
