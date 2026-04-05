"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Plus, Trash2, ChevronRight, ChevronLeft, Loader2, Award, CreditCard, Settings } from "lucide-react";

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

type LoyaltyProgram = { name: string; balance: string };
type CreditCardItem = { name: string; travelMultiplier: number; diningMultiplier: number; hotelMultiplier: number; annualCredit: number };
type Preferences = { seatPreference: string; hotelStyle: string; flightTime: string; budgetRange: string };

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgram[]>([{ name: "", balance: "" }]);
  const [creditCards, setCreditCards] = useState<CreditCardItem[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({
    seatPreference: "", hotelStyle: "", flightTime: "", budgetRange: "",
  });
  const [loading, setLoading] = useState(false);

  const addLoyalty = () => setLoyaltyPrograms([...loyaltyPrograms, { name: "", balance: "" }]);
  const removeLoyalty = (i: number) => setLoyaltyPrograms(loyaltyPrograms.filter((_, idx) => idx !== i));
  const updateLoyalty = (i: number, field: keyof LoyaltyProgram, val: string) => {
    setLoyaltyPrograms(loyaltyPrograms.map((lp, idx) => idx === i ? { ...lp, [field]: val } : lp));
  };

  const addCard = (preset: typeof CARD_PRESETS[0]) => {
    if (!creditCards.find(c => c.name === preset.name)) {
      setCreditCards([...creditCards, { ...preset }]);
    }
  };
  const removeCard = (i: number) => setCreditCards(creditCards.filter((_, idx) => idx !== i));

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loyaltyPrograms: loyaltyPrograms.filter(lp => lp.name.trim()),
          creditCards,
          preferences,
        }),
      });
      if (res.ok) router.push("/chat");
    } catch {}
    setLoading(false);
  };

  const steps = [
    { label: "Loyalty Programs", icon: <Award className="w-4 h-4" /> },
    { label: "Credit Cards", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Preferences", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#2a3048] py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#d4a843] rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-[#0a0e1a]" />
          </div>
          <span className="font-display text-xl font-bold text-[#f5f0e8]">Trippr</span>
        </div>
        <button onClick={() => router.push("/chat")} className="text-sm text-[#b8b0a0] hover:text-[#f5f0e8] transition-colors">
          Skip for now →
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-[#f5f0e8] mb-2">Set up your travel profile</h1>
            <p className="text-[#b8b0a0]">Help Trippr optimize every trip for you</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  i + 1 === step ? "bg-[#d4a843] text-[#0a0e1a]" :
                  i + 1 < step ? "bg-[#d4a843]/30 text-[#d4a843]" : "bg-[#2a3048] text-[#b8b0a0]"
                }`}>
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i + 1 === step ? "text-[#f5f0e8]" : "text-[#b8b0a0]"}`}>{s.label}</span>
                {i < steps.length - 1 && <div className={`h-px flex-1 ${i + 1 < step ? "bg-[#d4a843]/30" : "bg-[#2a3048]"}`} />}
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-6">
            {/* Step 1: Loyalty Programs */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-xl font-semibold text-[#f5f0e8] mb-1">Your loyalty programs</h2>
                <p className="text-[#b8b0a0] text-sm mb-4">Add your airline and hotel programs with current balances</p>
                {loyaltyPrograms.map((lp, i) => (
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
                      placeholder="Balance"
                      className="w-32 bg-[#141927] border border-[#2a3048] rounded-lg px-3 py-2.5 text-[#f5f0e8] text-sm focus:outline-none focus:border-[#d4a843] transition-colors"
                    />
                    {loyaltyPrograms.length > 1 && (
                      <button onClick={() => removeLoyalty(i)} className="p-2.5 text-[#b8b0a0] hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addLoyalty} className="flex items-center gap-2 text-sm text-[#d4a843] hover:text-[#e8c06a] transition-colors">
                  <Plus className="w-4 h-4" /> Add another program
                </button>
              </div>
            )}

            {/* Step 2: Credit Cards */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display text-xl font-semibold text-[#f5f0e8] mb-1">Your credit cards</h2>
                <p className="text-[#b8b0a0] text-sm mb-4">Select the travel cards you use</p>
                <div className="grid grid-cols-1 gap-2">
                  {CARD_PRESETS.map((preset) => {
                    const selected = creditCards.find(c => c.name === preset.name);
                    return (
                      <button
                        key={preset.name}
                        onClick={() => selected ? removeCard(creditCards.findIndex(c => c.name === preset.name)) : addCard(preset)}
                        className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                          selected ? "border-[#d4a843] bg-[#d4a843]/10" : "border-[#2a3048] bg-[#141927] hover:border-[#d4a843]/50"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-[#f5f0e8]">{preset.name}</div>
                          <div className="text-xs text-[#b8b0a0]">
                            {preset.travelMultiplier}x travel · {preset.hotelMultiplier}x hotel
                            {preset.annualCredit > 0 ? ` · $${preset.annualCredit} annual credit` : ""}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selected ? "bg-[#d4a843] border-[#d4a843]" : "border-[#2a3048]"
                        }`}>
                          {selected && <span className="text-[#0a0e1a] text-xs font-bold">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="font-display text-xl font-semibold text-[#f5f0e8] mb-1">Your travel preferences</h2>
                <p className="text-[#b8b0a0] text-sm mb-4">Trippr uses these to personalize every itinerary</p>

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
                            preferences[key as keyof Preferences] === opt
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
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-[#2a3048]">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2a3048] text-[#b8b0a0] hover:text-[#f5f0e8] hover:border-[#d4a843]/50 transition-all disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#d4a843] text-[#0a0e1a] font-semibold hover:bg-[#e8c06a] transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#d4a843] text-[#0a0e1a] font-semibold hover:bg-[#e8c06a] transition-colors disabled:opacity-60"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Saving..." : "Start planning ✈️"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
