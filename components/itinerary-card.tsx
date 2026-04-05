"use client";
import { useState } from "react";
import { Plane, Hotel, CreditCard, Award, ChevronDown, ChevronUp, Bookmark, Check, AlertCircle } from "lucide-react";

type ItineraryData = {
  title: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  flights: Array<{
    route: string;
    airline: string;
    flightClass: string;
    date: string;
    time: string;
    pointsCost: number;
    cashCost: number;
    loyaltyProgram: string;
    cardRecommendation: string;
  }>;
  hotels: Array<{
    name: string;
    neighborhood: string;
    nights: number;
    pointsCost: number;
    cashCost: number;
    loyaltyProgram: string;
    cardRecommendation: string;
  }>;
  totalPointsUsed: number;
  totalCashAlternative: number;
  pointsSavings: number;
  disclaimer: string;
};

export function ItineraryCard({ itinerary, conversationId }: { itinerary: ItineraryData; conversationId: string | null }) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: itinerary.title,
          destination: itinerary.destination,
          startDate: itinerary.startDate || null,
          endDate: itinerary.endDate || null,
          itineraryJson: itinerary,
          conversationId,
        }),
      });
      if (res.ok) setSaved(true);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="w-full bg-[#0a0e1a] border border-[#d4a843]/30 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#d4a843]/20 to-transparent p-4 border-b border-[#d4a843]/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-[#f5f0e8] text-lg leading-tight">{itinerary.title}</h3>
            <p className="text-[#d4a843] text-sm mt-0.5">{itinerary.destination}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-[#b8b0a0]">Points savings</div>
            <div className="font-display text-xl font-bold text-[#d4a843]">
              ${itinerary.pointsSavings?.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-sm">
            <Award className="w-3.5 h-3.5 text-[#d4a843]" />
            <span className="text-[#b8b0a0]">{itinerary.totalPointsUsed?.toLocaleString()} pts used</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <CreditCard className="w-3.5 h-3.5 text-[#d4a843]" />
            <span className="text-[#b8b0a0]">${itinerary.totalCashAlternative?.toLocaleString()} cash value</span>
          </div>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="p-4 space-y-4 animate-fade-in">
          {/* Flights */}
          {itinerary.flights?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#b8b0a0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Plane className="w-3 h-3" /> Flights
              </h4>
              <div className="space-y-2">
                {itinerary.flights.map((flight, i) => (
                  <div key={i} className="bg-[#141927] rounded-xl p-3 border border-[#2a3048]">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-[#f5f0e8] text-sm">{flight.route}</div>
                        <div className="text-xs text-[#b8b0a0]">{flight.airline} · {flight.flightClass} · {flight.date}</div>
                        <div className="text-xs text-[#b8b0a0]">{flight.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#d4a843] text-sm font-semibold">{flight.pointsCost?.toLocaleString()} pts</div>
                        <div className="text-xs text-[#b8b0a0]">or ${flight.cashCost?.toLocaleString()} cash</div>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs bg-[#d4a843]/10 text-[#d4a843] px-2 py-0.5 rounded-full">
                        <Award className="w-2.5 h-2.5" /> {flight.loyaltyProgram}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-[#2a3048] text-[#b8b0a0] px-2 py-0.5 rounded-full">
                        <CreditCard className="w-2.5 h-2.5" /> {flight.cardRecommendation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hotels */}
          {itinerary.hotels?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#b8b0a0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Hotel className="w-3 h-3" /> Hotels
              </h4>
              <div className="space-y-2">
                {itinerary.hotels.map((hotel, i) => (
                  <div key={i} className="bg-[#141927] rounded-xl p-3 border border-[#2a3048]">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-[#f5f0e8] text-sm">{hotel.name}</div>
                        <div className="text-xs text-[#b8b0a0]">{hotel.neighborhood} · {hotel.nights} nights</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#d4a843] text-sm font-semibold">{hotel.pointsCost?.toLocaleString()} pts</div>
                        <div className="text-xs text-[#b8b0a0]">or ${hotel.cashCost?.toLocaleString()} cash</div>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs bg-[#d4a843]/10 text-[#d4a843] px-2 py-0.5 rounded-full">
                        <Award className="w-2.5 h-2.5" /> {hotel.loyaltyProgram}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-[#2a3048] text-[#b8b0a0] px-2 py-0.5 rounded-full">
                        <CreditCard className="w-2.5 h-2.5" /> {hotel.cardRecommendation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex gap-2 text-xs text-[#b8b0a0] bg-[#141927] rounded-lg p-3">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#d4a843]" />
            <p>{itinerary.disclaimer}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-[#2a3048]">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-sm text-[#b8b0a0] hover:text-[#f5f0e8] transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expanded ? "Hide details" : "View details"}
        </button>

        <button
          onClick={handleSave}
          disabled={saved || saving}
          className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg transition-all font-medium ${
            saved
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-[#d4a843] text-[#0a0e1a] hover:bg-[#e8c06a] disabled:opacity-60"
          }`}
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Trip"}
        </button>
      </div>
    </div>
  );
}
