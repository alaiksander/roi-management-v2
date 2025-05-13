import React, { useState, ReactNode, useEffect, createContext, useContext } from "react";

// Semua teks UI dalam Bahasa Indonesia
export const UI_TEXT = {
  dashboard: "Dasbor",
  clients: "Klien",
  campaigns: "Kampanye",
  transactions: "Transaksi",
  reports: "Laporan",
  calendar: "Kalender",
  calendarDescription: "Lihat transaksi dan kampanye berdasarkan tanggal",
  addNew: "Tambah Baru",
  edit: "Ubah",
  delete: "Hapus",
  view: "Lihat",
  activeCampaigns: "Kampanye Aktif",
  noClientsFound: "Tidak ada klien yang cocok dengan pencarian Anda.",
  noCampaignsFound: "Tidak ada kampanye",
  noCampaignsCriteria: "Tidak ada kampanye yang cocok dengan kriteria pencarian Anda.",
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
};

// Language type
export type Language = "en" | "id";

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Create the context
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Custom hook for using the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Create the language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const savedLanguage = localStorage.getItem("appLanguage") as Language | null;
  const [language, setLanguageState] = useState<Language>(
    savedLanguage && ["en", "id"].includes(savedLanguage) ? savedLanguage : "en"
  );

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
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
