import React, { createContext, useState, useEffect, useCallback } from "react";

const ResumeContext = createContext();

const initialResume = {
  personal_info: {
    full_name: "",
    email: "",
    phone_number: "",
    linkedin_url: "",
    portfolio_url: ""
  },
  summary: "",
  targetRole: "",
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  education: [],
};

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(() => {
    const saved = window.sessionStorage.getItem("resumeData");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.contact) {
        parsed.personal_info = {
          full_name: parsed.contact.name || "",
          email: parsed.contact.email || "",
          phone_number: parsed.contact.phone || "",
          linkedin_url: parsed.contact.linkedin || "",
          portfolio_url: parsed.contact.portfolio || ""
        };
        delete parsed.contact;
        return parsed;
      }
      return parsed;
    }
    return initialResume;
  });
  const [saved, setSaved] = useState(true);

  // ✅ CRITICAL FIX: Wrap functions in useCallback to stabilize them.
  // This prevents infinite re-render loops in components that use them.
  const updateResumeData = useCallback((data) => {
    setResumeData(data);
    setSaved(false);
  }, []); // Empty dependency array [] means this function is created only once.

  const resetResume = useCallback(() => {
    setResumeData(initialResume);
    setSaved(false);
  }, []);

  // This effect correctly saves data to session storage whenever it changes.
  useEffect(() => {
    window.sessionStorage.setItem("resumeData", JSON.stringify(resumeData));
    setSaved(true);
  }, [resumeData]);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData: updateResumeData, saved, resetResume }}>
      {children}
    </ResumeContext.Provider>
  );
};

export { ResumeContext };