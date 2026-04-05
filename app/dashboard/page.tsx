"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MapPin, Calendar, Trash2, Plus, Plane, Loader2 } from "lucide-react";

type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  createdAt: string;
  itineraryJson: any;
};

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/trips")
      .then(r => r.json())
      .then(data => { setTrips(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const deleteTrip = async (id: string) => {
    if (!confirm("Delete this trip?")) return;
    await fetch(`/api/trips/${id}`, { method: "DELETE" });
    setTrips(trips.filter(t => t.id !== id));
  };

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#f5f0e8]">My Trips</h1>
            <p className="text-[#b8b0a0] mt-1">{trips.length} saved {trips.length === 1 ? "itinerary" : "itineraries"}</p>
          </div>
          <Link
            href="/chat"
            className="flex items-center gap-2 bg-[#d4a843] text-[#0a0e1a] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#e8c06a] transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#d4a843] animate-spin" />
          </div>
        ) : trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-[#141927] rounded-2xl flex items-center justify-center mb-4">
              <Plane className="w-8 h-8 text-[#d4a843]/40" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[#f5f0e8] mb-2">No trips saved yet</h2>
            <p className="text-[#b8b0a0] mb-6">Start a chat with Trippr to plan your first optimized trip</p>
            <Link href="/chat" className="bg-[#d4a843] text-[#0a0e1a] px-6 py-3 rounded-xl font-semibold hover:bg-[#e8c06a] transition-colors">
              Plan a trip →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => {
              const itinerary = trip.itineraryJson as any;
              return (
                <div key={trip.id} className="bg-[#141927] border border-[#2a3048] rounded-2xl overflow-hidden hover:border-[#d4a843]/30 transition-all group">
                  <div className="h-2 bg-gradient-to-r from-[#d4a843] to-[#e8c06a]" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-display font-bold text-[#f5f0e8] text-base leading-tight">{trip.title}</h3>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="p-1.5 text-[#b8b0a0] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-[#d4a843] mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {trip.destination}
                    </div>

                    {(trip.startDate || trip.endDate) && (
                      <div className="flex items-center gap-1.5 text-sm text-[#b8b0a0] mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(trip.startDate)}
                        {trip.endDate && ` — ${formatDate(trip.endDate)}`}
                      </div>
                    )}

                    {itinerary?.totalPointsUsed && (
                      <div className="bg-[#d4a843]/10 rounded-lg px-3 py-2 flex justify-between text-xs">
                        <span className="text-[#b8b0a0]">Points used</span>
                        <span className="text-[#d4a843] font-semibold">{itinerary.totalPointsUsed.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        trip.status === "saved" ? "bg-green-500/15 text-green-400" :
                        trip.status === "booked" ? "bg-blue-500/15 text-blue-400" :
                        "bg-[#2a3048] text-[#b8b0a0]"
                      }`}>
                        {trip.status}
                      </span>
                      <span className="text-xs text-[#b8b0a0]">
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
