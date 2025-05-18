import React from "react";
import { MessageCircle, UserPlus } from "lucide-react";

const FEEDBACK_LINK = "https://docs.google.com/forms/d/e/1FAIpQLScURp5VNNPrie9LDcoj45CcFgzVQU-mKN-Na5BHYxQYPsi6pQ/viewform?usp=header";
const WAITLIST_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSfBgaSSMY6lPBotm8Ew_TRX55VX5Opgngf1eFDQhux5JKEkjQ/viewform?usp=header";

const SidebarFeedbackWaitlist = () => (
  <div className="flex flex-col gap-3 mt-8 px-4">
    <a
      href={FEEDBACK_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-md bg-blue-100 text-blue-700 px-3 py-2 font-medium hover:bg-blue-200 transition"
    >
      <MessageCircle className="w-4 h-4" />
      Beri Masukan
    </a>
    <a
      href={WAITLIST_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-md bg-green-100 text-green-700 px-3 py-2 font-medium hover:bg-green-200 transition"
    >
      <UserPlus className="w-4 h-4" />
      Daftar Tunggu
    </a>
  </div>
);

export default SidebarFeedbackWaitlist;