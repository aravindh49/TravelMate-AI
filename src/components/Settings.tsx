import { Globe, Bell, Shield, User } from "lucide-react";
import { haptics } from "../lib/utils";

interface SettingsProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export function Settings({ language, setLanguage }: SettingsProps) {
  const languages = [
    "English",
    "Tamil",
    "Hindi",
    "Spanish",
    "French",
    "German",
    "Japanese",
  ];

  return (
    <div className="h-full overflow-y-auto p-8 bg-[#f5f5f0]">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#5A5A40] mb-2">Settings</h1>
          <p className="text-[#8E9299] font-sans">Manage your preferences and profile</p>
        </header>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e5e5e0]">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#e5e5e0]">
            <div className="w-16 h-16 rounded-full bg-[#5A5A40] flex items-center justify-center text-white text-2xl font-bold">
              U
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1a1a1a]">TravelMate User</h2>
              <p className="text-[#8E9299] font-sans">user@example.com</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-[#5A5A40] mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language Preferences
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      haptics.light();
                      setLanguage(lang);
                    }}
                    className={`px-4 py-3 rounded-2xl border text-sm font-sans transition-all ${
                      language === lang
                        ? "bg-[#5A5A40] text-white border-[#5A5A40] shadow-md"
                        : "bg-white text-[#4a4a4a] border-[#e5e5e0] hover:border-[#5A5A40]"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#5A5A40] mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-[#e5e5e0] rounded-2xl cursor-pointer hover:bg-[#f5f5f0] transition-colors" onClick={() => haptics.light()}>
                  <div>
                    <p className="font-bold text-[#1a1a1a]">Booking Confirmations</p>
                    <p className="text-sm text-[#8E9299] font-sans">Receive email and SMS updates</p>
                  </div>
                  <div className="w-12 h-6 bg-[#5A5A40] rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between p-4 border border-[#e5e5e0] rounded-2xl cursor-pointer hover:bg-[#f5f5f0] transition-colors" onClick={() => haptics.light()}>
                  <div>
                    <p className="font-bold text-[#1a1a1a]">Eco Impact Reports</p>
                    <p className="text-sm text-[#8E9299] font-sans">Monthly sustainability summary</p>
                  </div>
                  <div className="w-12 h-6 bg-[#5A5A40] rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </label>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#5A5A40] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy
              </h3>
              <div className="p-4 border border-[#e5e5e0] rounded-2xl bg-[#f5f5f0]">
                <p className="text-sm text-[#4a4a4a] font-sans leading-relaxed">
                  Your data is securely stored and never shared with third parties. TravelMate AI uses your location only to provide nearby recommendations.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
