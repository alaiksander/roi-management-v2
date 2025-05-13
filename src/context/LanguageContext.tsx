
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define available languages
export type Language = "en" | "id";

// Define the context shape
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
};

// Create translations for each language
const translationDict: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    clients: "Clients",
    campaigns: "Campaigns",
    transactions: "Transactions",
    reports: "Reports",
    calendar: "Calendar",
    addNew: "Add New",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    search: "Search",
    name: "Name",
    email: "Email",
    phone: "Phone",
    status: "Status",
    date: "Date",
    amount: "Amount",
    description: "Description",
    client: "Client",
    campaign: "Campaign",
    type: "Type",
    selectLanguage: "Select language",
  },
  id: {
    dashboard: "Dasbor",
    clients: "Klien",
    campaigns: "Kampanye",
    transactions: "Transaksi",
    reports: "Laporan",
    calendar: "Kalender",
    addNew: "Tambah Baru",
    edit: "Ubah",
    delete: "Hapus",
    view: "Lihat",
    save: "Simpan",
    cancel: "Batal",
    confirm: "Konfirmasi",
    search: "Cari",
    name: "Nama",
    email: "Surel",
    phone: "Telepon",
    status: "Status",
    date: "Tanggal",
    amount: "Jumlah",
    description: "Deskripsi",
    client: "Klien",
    campaign: "Kampanye",
    type: "Tipe",
    selectLanguage: "Pilih bahasa",
  },
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  translations: translationDict.en,
});

// Create a hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Create the language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to get saved language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("appLanguage") as Language;
    return savedLanguage && ["en", "id"].includes(savedLanguage) ? savedLanguage : "en";
  });

  const translations = translationDict[language];

  // Update localStorage when language changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("appLanguage", newLanguage);
  };

  // Set the document language attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
