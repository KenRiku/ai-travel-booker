"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Plane, Menu, X, User, LayoutDashboard, MessageSquare, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#2a3048]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#d4a843] rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-[#0a0e1a]" />
          </div>
          <span className="font-display text-xl font-bold text-[#f5f0e8]">Trippr</span>
        </Link>

        {session ? (
          <div className="flex items-center gap-1">
            <Link href="/chat" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-[#b8b0a0] hover:text-[#f5f0e8] hover:bg-[#1a2035] transition-all text-sm">
              <MessageSquare className="w-4 h-4" />
              Chat
            </Link>
            <Link href="/dashboard" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-[#b8b0a0] hover:text-[#f5f0e8] hover:bg-[#1a2035] transition-all text-sm">
              <LayoutDashboard className="w-4 h-4" />
              Trips
            </Link>
            <Link href="/profile" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-[#b8b0a0] hover:text-[#f5f0e8] hover:bg-[#1a2035] transition-all text-sm">
              <User className="w-4 h-4" />
              Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-[#b8b0a0] hover:text-red-400 hover:bg-[#1a2035] transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
            <button className="md:hidden p-2 text-[#b8b0a0]" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#b8b0a0] hover:text-[#f5f0e8] transition-colors">Sign in</Link>
            <Link href="/signup" className="text-sm bg-[#d4a843] text-[#0a0e1a] px-4 py-2 rounded-lg font-semibold hover:bg-[#e8c06a] transition-colors">Get Started</Link>
          </div>
        )}
      </div>

      {menuOpen && session && (
        <div className="md:hidden border-t border-[#2a3048] bg-[#0a0e1a] px-4 py-3 flex flex-col gap-2">
          <Link href="/chat" className="flex items-center gap-2 p-2 rounded-lg text-[#b8b0a0] hover:text-[#f5f0e8]" onClick={() => setMenuOpen(false)}>
            <MessageSquare className="w-4 h-4" /> Chat
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-lg text-[#b8b0a0] hover:text-[#f5f0e8]" onClick={() => setMenuOpen(false)}>
            <LayoutDashboard className="w-4 h-4" /> My Trips
          </Link>
          <Link href="/profile" className="flex items-center gap-2 p-2 rounded-lg text-[#b8b0a0] hover:text-[#f5f0e8]" onClick={() => setMenuOpen(false)}>
            <User className="w-4 h-4" /> Profile
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 p-2 rounded-lg text-red-400">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
