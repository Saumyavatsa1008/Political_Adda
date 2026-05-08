"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User as UserIcon, ChevronDown, BarChart3 } from "lucide-react";

// Inline SVG social icons (no external dependency required)
const YtIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-600"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-blue-600"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
);
const IgIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-pink-600"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311C2.499 19.467 2.225 18.2 2.163 16.834 2.105 15.568 2.093 15.188 2.093 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608C4.449 2.567 5.716 2.293 7.082 2.231 8.348 2.175 8.728 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948C23.843 5.197 23.327 3.355 21.986 2.014 20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-gray-800"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

// ─── Categories Dropdown ───────────────────────────────────────────────
const CATEGORY_ITEMS = [
  { label: "Politics", href: "/category/politics" },
  { label: "Entertainment", href: "/category/entertainment" },
  { label: "Sports", href: "/category/sports" },
  { label: "Technology", href: "/category/technology" },
  { label: "National", href: "/category/national" },
];

// ─── Indian States & UTs (alphabetical) ───────────────────────────────
const INDIAN_STATES = [
  { label: "Andhra Pradesh", href: "/state/andhra-pradesh" },
  { label: "Andaman & Nicobar", href: "/state/andaman-nicobar" },
  { label: "Arunachal Pradesh", href: "/state/arunachal-pradesh" },
  { label: "Assam", href: "/state/assam" },
  { label: "Bihar", href: "/state/bihar" },
  { label: "Chandigarh", href: "/state/chandigarh" },
  { label: "Chhattisgarh", href: "/state/chhattisgarh" },
  { label: "Dadra & Nagar Haveli", href: "/state/dadra-nagar-haveli" },
  { label: "Daman & Diu", href: "/state/daman-diu" },
  { label: "Delhi", href: "/state/delhi" },
  { label: "Goa", href: "/state/goa" },
  { label: "Gujarat", href: "/state/gujarat" },
  { label: "Haryana", href: "/state/haryana" },
  { label: "Himachal Pradesh", href: "/state/himachal-pradesh" },
  { label: "Jammu & Kashmir", href: "/state/jammu-kashmir" },
  { label: "Jharkhand", href: "/state/jharkhand" },
  { label: "Karnataka", href: "/state/karnataka" },
  { label: "Kerala", href: "/state/kerala" },
  { label: "Ladakh", href: "/state/ladakh" },
  { label: "Lakshadweep", href: "/state/lakshadweep" },
  { label: "Madhya Pradesh", href: "/state/madhya-pradesh" },
  { label: "Maharashtra", href: "/state/maharashtra" },
  { label: "Manipur", href: "/state/manipur" },
  { label: "Meghalaya", href: "/state/meghalaya" },
  { label: "Mizoram", href: "/state/mizoram" },
  { label: "Nagaland", href: "/state/nagaland" },
  { label: "Odisha", href: "/state/odisha" },
  { label: "Puducherry", href: "/state/puducherry" },
  { label: "Punjab", href: "/state/punjab" },
  { label: "Rajasthan", href: "/state/rajasthan" },
  { label: "Sikkim", href: "/state/sikkim" },
  { label: "Tamil Nadu", href: "/state/tamil-nadu" },
  { label: "Telangana", href: "/state/telangana" },
  { label: "Tripura", href: "/state/tripura" },
  { label: "Uttar Pradesh", href: "/state/uttar-pradesh" },
  { label: "Uttarakhand", href: "/state/uttarakhand" },
  { label: "West Bengal", href: "/state/west-bengal" },
];

// ─── Social Media Links ────────────────────────────────────────────────
const SOCIAL_ITEMS = [
  { label: "YouTube",   href: "https://youtube.com/@thepoliticaladda?si=O4fcmdlJWqqlXJhv",   Icon: YtIcon },
  { label: "Facebook",  href: "https://www.facebook.com/share/1BuTSGcyCz/?mibextid=wwXIfr",  Icon: FbIcon },
  { label: "Instagram", href: "https://www.instagram.com/politicaladda01?igsh=NXo2aGMxbjliczdq", Icon: IgIcon },
  { label: "Twitter / X", href: "https://x.com/politicaladda01?s=21", Icon: XIcon  },
];

// ─── Reusable Dropdown Component ───────────────────────────────────────
function NavDropdown({
  label,
  children,
  scrollable = false,
}: {
  label: string;
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1 text-gray-700 hover:text-red-600 font-semibold text-sm uppercase tracking-wide transition-colors"
      >
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 min-w-[180px] py-2 transition-all ${
            scrollable ? "max-h-72 overflow-y-auto w-56" : "w-52"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar ───────────────────────────────────────────────────────
export default function Navbar() {
  const { user, role, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null); // ← FIXED
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleMobile = (section: string) =>
    setMobileSection((cur) => (cur === section ? null : section));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        .nav-dropdown-item {
          display: block;
          padding: 8px 16px;
          font-size: 0.875rem;
          color: #374151;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .nav-dropdown-item:hover {
          background: #fef2f2;
          color: #dc2626;
        }
        .nav-dropdown-icon-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 16px;
          font-size: 0.875rem;
          color: #374151;
          transition: background 0.15s;
        }
        .nav-dropdown-icon-item:hover {
          background: #f9fafb;
        }
      `}</style>

      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* ── Brand ── */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-lg text-lg shadow tracking-tight leading-tight">
                Political<span className="text-red-200"> Adda</span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center space-x-6">

              {/* Categories Dropdown */}
              <NavDropdown label="Categories">
                {CATEGORY_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-dropdown-item"
                  >
                    {item.label}
                  </Link>
                ))}
              </NavDropdown>

              {/* States Dropdown */}
              <NavDropdown label="States" scrollable>
                {INDIAN_STATES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-dropdown-item"
                  >
                    {item.label}
                  </Link>
                ))}
              </NavDropdown>

              {/* Social Media Dropdown */}
              <NavDropdown label="Political Adda">
                {SOCIAL_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-dropdown-icon-item"
                  >
                    <item.Icon />
                    <span>{item.label}</span>
                  </a>
                ))}
              </NavDropdown>

              <Link
                href="/category/national"
                className="text-gray-700 hover:text-red-600 font-semibold text-sm uppercase tracking-wide transition-colors"
              >
                National
              </Link>

              {/* Live Poll Link */}
              <Link
                href="/#poll"
                className="flex items-center gap-1.5 text-sm font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                onClick={() => {
                  if (window.location.pathname === '/') {
                    document.getElementById('poll')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Live Poll
              </Link>
            </div>

            {/* ── Auth (Desktop) ── */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 py-1.5 px-3 rounded-full hover:bg-gray-50 transition focus:outline-none"
                  >
                    <UserIcon className="w-4 h-4" />
                    {user.displayName?.split(" ")[0]}
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 w-48 mt-1 bg-white rounded-xl shadow-lg py-1 border border-gray-100 z-[100]">
                      {role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          setShowProfileMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* ── Mobile Hamburger ── */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="block h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="block h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="pt-2 pb-4 space-y-1">

              {/* Categories accordion */}
              <button
                onClick={() => toggleMobile("categories")}
                className="w-full flex items-center justify-between px-4 py-2.5 text-base font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                Categories
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${mobileSection === "categories" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileSection === "categories" &&
                CATEGORY_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50"
                  >
                    {item.label}
                  </Link>
                ))}

              {/* States accordion */}
              <button
                onClick={() => toggleMobile("states")}
                className="w-full flex items-center justify-between px-4 py-2.5 text-base font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                States
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${mobileSection === "states" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileSection === "states" && (
                <div className="max-h-60 overflow-y-auto">
                  {INDIAN_STATES.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Social Media accordion */}
              <button
                onClick={() => toggleMobile("social")}
                className="w-full flex items-center justify-between px-4 py-2.5 text-base font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                Political Adda
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${mobileSection === "social" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileSection === "social" &&
                SOCIAL_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <item.Icon />
                    {item.label}
                  </a>
                ))}

              <Link
                href="/category/national"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-base font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                National
              </Link>

              <Link
                href="/#poll"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-base font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                Vote in Live Poll
              </Link>

              {/* Auth */}
              <div className="border-t border-gray-200 pt-3 mt-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm font-medium text-gray-800">
                      {user.displayName}
                    </div>
                    {role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setIsOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-red-600 hover:bg-gray-50"
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}