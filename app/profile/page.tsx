"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Plus, Trash2, Loader2, Save, Award, CreditCard, Settings, Gem } from "lucide-react";

const LOYALTY_PRESETS = [
  "United MileagePlus", "Delta SkyMiles", "American AAdvantage",
  "Southwest Rapid Rewards", "Alaska Mileage Plan", "Marriott Bonvoy",
  "Hilton Honors", "World of Hyatt", "IHG One Rewards", "Wyndham Rewards",
];

const CARD_PRESETS = [
  { name: "Chase Sapphire Reserve", travelMultiplier: 3, diningMultiplier: 3, hotelMultiplier: 3, annualCredit: 300 },
  { name: "Chase Sapphire Preferred", travelMultiplier: 2, diningMultiplier: 3, hotelMultiplier: 2, annualCredit: 0 },
  { name: "Amex Platinum", travelMultiplier: 5, diningMultiplier: 1, hotelMultiplier: 5, annualCredit: 200 },
  { name: "Amex Gold", travelMultiplier: 3, diningMultiplier: 4, hotelMultiplier: 3, annualCredit: 100 },
  { name: "Capital One Venture X", travelMultiplier: 5, diningMultiplier: 2, hotelMultiplier: 5, annualCredit: 300 },
  { name: "Citi Premier", travelMultiplier: 3, diningMultiplier: 3, hotelMultiplier: 3, annualCredit: 0 },
  { name: "Other / Custom", travelMultiplier: 1, diningMultiplier: 1, hotelMultiplier: 1, annualCredit: 0 },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<any[]>([]);
  const [creditCards, setCreditCards] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        setProfile(data);
        setLoyaltyPrograms(data.loyaltyPrograms || []);
        setCreditCards(data.creditCards || []);
        setPreferences({
          seatPreference: data.seatPreference || "",
          hotelStyle: data.hotelStyle || "",
          flightTime: data.flightTime || "",
          budgetRange: data.budgetRange || "",
        });
        setLoading(false);
      });
  }, []);

  const addLoyalty = () => setLoyaltyPrograms([...loyaltyPrograms, { name: "", balance: 0 }]);
  const removeLoyalty = (i: number) => setLoyaltyPrograms(loyaltyPrograms.filter((_: any, idx: number) => idx !== i));
  const updateLoyalty = (i: number, field: string, val: any) =>
    setLoyaltyPrograms(loyaltyPrograms.map((lp: any, idx: number) => idx === i ? { ...lp, [field]: val } : lp));

  const toggleCard = (preset: typeof CARD_PRESETS[0]) => {
    const idx = creditCards.findIndex((c: any) => c.name === preset.name);
    if (idx >= 0) setCreditCards(creditCards.filter((_: any, i: number) => i !== idx));
    else setCreditCards([...creditCards, { ...preset }]);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loyaltyPrograms, creditCards, preferences }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
      <Navbar />
      <Loader2 className="w-6 h-6 text-[#d4a843] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#f5f0e8]">{profile?.name}</h1>
            <p className="text-[#b8b0a0] mt-1">{profile?.email}</p>
          </div>
          {profile?.isPremium && (
            <div className="flex items-center gap-1.5 bg-[#d4a843]/10 border border-[#d4a843]/30 rounded-full px-3 py-1.5 text-sm text-[#d4a843]">
              <Gem className="w-3.5 h-3.5" /> Premium
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Loyalty Programs */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold text-[#f5f0e8] mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#d4a843]" /> Loyalty Programs
            </h2>
            <div className="space-y-3">
              {loyaltyPrograms.map((lp: any, i: number) => (
                <div key={i} className="flex gap-2">
                  <select
                    value={lp.name}
                    onChange={e => updateLoyalty(i, "name", e.target.value)}
                    className="flex-1 bg-[#141927] border border-[#2a3048] rounded-lg px-3 py-2.5 text-[#f5f0e8] text-sm focus:outline-none focus:border-[#d4a843] transition-colors"
                  >
                    <option value="">Select program...</option>
                    {LOYALTY_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input
                    type="number"
                    value={lp.balance}
                    onChange={e => updateLoyalty(i, "balance", e.target.value)}
                    className="w-28 bg-[#141927] border border-[#2a3048] rounded-lg px-3 py-2.5 text-[#f5f0e8] text-sm focus:outline-none focus:border-[#d4a843] transition-colors"
                    placeholder="Balance"
                  />
                  <button onClick={() => removeLoyalty(i)} className="p-2.5 text-[#b8b0a0] hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addLoyalty} className="mt-3 flex items-center gap-2 text-sm text-[#d4a843] hover:text-[#e8c06a] transition-colors">
              <Plus className="w-4 h-4" /> Add program
            </button>
          </div>

          {/* Credit Cards */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold text-[#f5f0e8] mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#d4a843]" /> Credit Cards
            </h2>
            <div className="grid gap-2">
              {CARD_PRESETS.map(preset => {
                const selected = creditCards.find((c: any) => c.name === preset.name);
                return (
                  <button
                    key={preset.name}
                    onClick={() => toggleCard(preset)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      selected ? "border-[#d4a843] bg-[#d4a843]/10" : "border-[#2a3048] bg-[#141927] hover:border-[#d4a843]/50"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium text-[#f5f0e8]">{preset.name}</div>
                      <div className="text-xs text-[#b8b0a0]">{preset.travelMultiplier}x travel · {preset.hotelMultiplier}x hotel</div>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selected ? "bg-[#d4a843] border-[#d4a843]" : "border-[#2a3048]"}`}>
                      {selected && <span className="text-[#0a0e1a] text-xs font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferences */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold text-[#f5f0e8] mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#d4a843]" /> Travel Preferences
            </h2>
            <div className="space-y-4">
              {[
                { label: "Seat preference", key: "seatPreference", opts: ["window", "aisle", "no_preference"] },
                { label: "Hotel style", key: "hotelStyle", opts: ["boutique", "chain", "luxury", "budget"] },
                { label: "Preferred flight time", key: "flightTime", opts: ["morning", "afternoon", "red_eye", "no_preference"] },
                { label: "Budget range", key: "budgetRange", opts: ["budget", "moderate", "premium"] },
              ].map(({ label, key, opts }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-[#b8b0a0] mb-2">{label}</label>
                  <div className="flex flex-wrap gap-2">
                    {opts.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setPreferences({ ...preferences, [key]: opt })}
                        className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                          preferences[key] === opt
                            ? "bg-[#d4a843] text-[#0a0e1a] font-semibold"
                            : "bg-[#141927] border border-[#2a3048] text-[#b8b0a0] hover:border-[#d4a843]/50 hover:text-[#f5f0e8]"
                        }`}
                      >
                        {opt.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              saved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-[#d4a843] text-[#0a0e1a] hover:bg-[#e8c06a]"
            } disabled:opacity-60`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
