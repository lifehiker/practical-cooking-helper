"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ChefHat, Menu, X, User, LogOut, BookOpen, Settings } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-green-700 text-lg">
            <ChefHat className="w-5 h-5" />
            FridgeMeal
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/ingredients-to-meals" className="hover:text-green-700 transition-colors">
              Ingredient Ideas
            </Link>
            <Link href="/recipe-extractor" className="hover:text-green-700 transition-colors">
              Recipe Extractor
            </Link>
            {session && (
              <Link href="/library" className="hover:text-green-700 transition-colors">
                My Library
              </Link>
            )}
            <Link href="/pricing" className="hover:text-green-700 transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="max-w-[120px] truncate">{session.user?.name ?? session.user?.email}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/library"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <BookOpen className="w-4 h-4" /> My Library
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" /> Account
                    </Link>
                    {(session.user as { role?: string })?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" /> Admin
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { void signOut(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/pricing"
                  className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                  Get Pro
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 text-gray-500"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link
            href="/ingredients-to-meals"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700"
          >
            Ingredient Ideas
          </Link>
          <Link
            href="/recipe-extractor"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700"
          >
            Recipe Extractor
          </Link>
          {session && (
            <Link
              href="/library"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700"
            >
              My Library
            </Link>
          )}
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700"
          >
            Pricing
          </Link>
          <hr className="border-gray-100" />
          {session ? (
            <button
              onClick={() => void signOut()}
              className="block py-2 text-sm font-medium text-red-600"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-green-700"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
