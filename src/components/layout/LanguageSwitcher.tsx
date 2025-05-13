import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={e => setLanguage(e.target.value as "en" | "id")}
      className="border rounded px-2 py-1"
      aria-label="Select language"
    >
      <option value="en">English</option>
      <option value="id">Bahasa Indonesia</option>
    </select>
  );
};
