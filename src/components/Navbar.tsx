import { useState } from "react";
import { Menu, X, Leaf, LogOut, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { User } from "../utils/db";

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setTab: (tab: string) => void;
  onLogout: () => void;
}

const dashboardHashes = [
  { label: "Overview", href: "#overview" },
  { label: "Globe", href: "#globe" },
  { label: "Sectors", href: "#sectors" },
  { label: "Countries", href: "#countries" },
  { label: "Timeline", href: "#timeline" },
  { label: "Impact", href: "#impact" },
  { label: "Solutions", href: "#solutions" },
];

export default function Navbar({ user, activeTab, setTab, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to handle tab changes and close mobile menu
  const handleTabSelect = (tab: string) => {
    setTab(tab);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand/Logo */}
          <div 
            onClick={() => handleTabSelect("dashboard3d")} 
            className="flex items-center gap-2 text-emerald-400 font-bold text-xl cursor-pointer select-none"
          >
            <Leaf className="w-6 h-6 animate-pulse" />
            <span>PG Food Waste</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* If on 3D Dashboard view, show section scroll links */}
            {activeTab === "dashboard3d" && !user && (
              <div className="flex items-center gap-6 border-r border-white/10 pr-6 mr-2">
                {dashboardHashes.map((link) => (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    className="text-stone-400 hover:text-emerald-400 font-medium text-xs transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* Standard Dashboard Nav link */}
            <button
              onClick={() => handleTabSelect("dashboard3d")}
              className={`font-medium text-sm transition-colors py-2 px-3 rounded-lg border-0 cursor-pointer ${
                activeTab === "dashboard3d"
                  ? "text-emerald-400 bg-white/5"
                  : "text-stone-400 hover:text-emerald-400 bg-transparent"
              }`}
              style={{ boxShadow: 'none' }}
            >
              Global Analytics
            </button>

            {/* Role-Specific Tabs */}
            {user && user.role === "resident" && (
              <>
                <button
                  onClick={() => handleTabSelect("order")}
                  className={`font-medium text-sm transition-colors py-2 px-3 rounded-lg border-0 cursor-pointer ${
                    activeTab === "order"
                      ? "text-emerald-400 bg-white/5"
                      : "text-stone-400 hover:text-emerald-400 bg-transparent"
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  Request Food
                </button>
                <button
                  onClick={() => handleTabSelect("my_requests")}
                  className={`font-medium text-sm transition-colors py-2 px-3 rounded-lg border-0 cursor-pointer ${
                    activeTab === "my_requests"
                      ? "text-emerald-400 bg-white/5"
                      : "text-stone-400 hover:text-emerald-400 bg-transparent"
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  My Requests
                </button>
                <button
                  onClick={() => handleTabSelect("contact")}
                  className={`font-medium text-sm transition-colors py-2 px-3 rounded-lg border-0 cursor-pointer ${
                    activeTab === "contact"
                      ? "text-emerald-400 bg-white/5"
                      : "text-stone-400 hover:text-emerald-400 bg-transparent"
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  Submit Support
                </button>
              </>
            )}

            {user && user.role === "manager" && (
              <>
                <button
                  onClick={() => handleTabSelect("inventory")}
                  className={`font-medium text-sm transition-colors py-2 px-3 rounded-lg border-0 cursor-pointer ${
                    activeTab === "inventory"
                      ? "text-emerald-400 bg-white/5"
                      : "text-stone-400 hover:text-emerald-400 bg-transparent"
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  Inventory
                </button>
                <button
                  onClick={() => handleTabSelect("approve_carts")}
                  className={`font-medium text-sm transition-colors py-2 px-3 rounded-lg border-0 cursor-pointer ${
                    activeTab === "approve_carts"
                      ? "text-emerald-400 bg-white/5"
                      : "text-stone-400 hover:text-emerald-400 bg-transparent"
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  Approve Requests
                </button>
                <button
                  onClick={() => handleTabSelect("support_center")}
                  className={`font-medium text-sm transition-colors py-2 px-3 rounded-lg border-0 cursor-pointer ${
                    activeTab === "support_center"
                      ? "text-emerald-400 bg-white/5"
                      : "text-stone-400 hover:text-emerald-400 bg-transparent"
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  Resolve Support
                </button>
                <button
                  onClick={() => handleTabSelect("upload")}
                  className={`font-medium text-sm transition-colors py-2 px-3 rounded-lg border-0 cursor-pointer ${
                    activeTab === "upload"
                      ? "text-emerald-400 bg-white/5"
                      : "text-stone-400 hover:text-emerald-400 bg-transparent"
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  Log Waste
                </button>
                <button
                  onClick={() => handleTabSelect("reports")}
                  className={`font-medium text-sm transition-colors py-2 px-3 rounded-lg border-0 cursor-pointer ${
                    activeTab === "reports"
                      ? "text-emerald-400 bg-white/5"
                      : "text-stone-400 hover:text-emerald-400 bg-transparent"
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  Reports
                </button>
              </>
            )}

            {/* Auth Actions / User profile info */}
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.slice(0, 2)}
                  </div>
                  <div className="text-left leading-none">
                    <div className="text-xs font-semibold text-white">{user.name}</div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-stone-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-0"
                  style={{ boxShadow: 'none' }}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabSelect("login")}
                className="btn text-xs font-bold px-4 py-2 border-0"
              >
                Hostel Mess Login
              </button>
            )}

          </div>

          {/* Hamburger Menu Toggle Button */}
          <button 
            className="md:hidden p-2 text-stone-400 border-0 bg-transparent cursor-pointer" 
            onClick={() => setIsOpen(!isOpen)}
            style={{ boxShadow: 'none' }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => handleTabSelect("dashboard3d")}
                className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors border-0 cursor-pointer ${
                  activeTab === "dashboard3d"
                    ? "text-emerald-400 bg-white/5"
                    : "text-stone-400 hover:text-emerald-400 bg-transparent"
                }`}
                style={{ boxShadow: 'none' }}
              >
                Global Analytics
              </button>

              {/* Role Specific items on Mobile */}
              {user && user.role === "resident" && (
                <>
                  <button
                    onClick={() => handleTabSelect("order")}
                    className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors border-0 cursor-pointer ${
                      activeTab === "order"
                        ? "text-emerald-400 bg-white/5"
                        : "text-stone-400 hover:text-emerald-400 bg-transparent"
                    }`}
                    style={{ boxShadow: 'none' }}
                  >
                    Request Food
                  </button>
                  <button
                    onClick={() => handleTabSelect("my_requests")}
                    className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors border-0 cursor-pointer ${
                      activeTab === "my_requests"
                        ? "text-emerald-400 bg-white/5"
                        : "text-stone-400 hover:text-emerald-400 bg-transparent"
                    }`}
                    style={{ boxShadow: 'none' }}
                  >
                    My Requests
                  </button>
                  <button
                    onClick={() => handleTabSelect("contact")}
                    className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors border-0 cursor-pointer ${
                      activeTab === "contact"
                        ? "text-emerald-400 bg-white/5"
                        : "text-stone-400 hover:text-emerald-400 bg-transparent"
                    }`}
                    style={{ boxShadow: 'none' }}
                  >
                    Submit Support
                  </button>
                </>
              )}

              {user && user.role === "manager" && (
                <>
                  <button
                    onClick={() => handleTabSelect("inventory")}
                    className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors border-0 cursor-pointer ${
                      activeTab === "inventory"
                        ? "text-emerald-400 bg-white/5"
                        : "text-stone-400 hover:text-emerald-400 bg-transparent"
                    }`}
                    style={{ boxShadow: 'none' }}
                  >
                    Inventory
                  </button>
                  <button
                    onClick={() => handleTabSelect("approve_carts")}
                    className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors border-0 cursor-pointer ${
                      activeTab === "approve_carts"
                        ? "text-emerald-400 bg-white/5"
                        : "text-stone-400 hover:text-emerald-400 bg-transparent"
                    }`}
                    style={{ boxShadow: 'none' }}
                  >
                    Approve Requests
                  </button>
                  <button
                    onClick={() => handleTabSelect("support_center")}
                    className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors border-0 cursor-pointer ${
                      activeTab === "support_center"
                        ? "text-emerald-400 bg-white/5"
                        : "text-stone-400 hover:text-emerald-400 bg-transparent"
                    }`}
                    style={{ boxShadow: 'none' }}
                  >
                    Resolve Support
                  </button>
                  <button
                    onClick={() => handleTabSelect("upload")}
                    className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors border-0 cursor-pointer ${
                      activeTab === "upload"
                        ? "text-emerald-400 bg-white/5"
                        : "text-stone-400 hover:text-emerald-400 bg-transparent"
                    }`}
                    style={{ boxShadow: 'none' }}
                  >
                    Log Waste
                  </button>
                  <button
                    onClick={() => handleTabSelect("reports")}
                    className={`block w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors border-0 cursor-pointer ${
                      activeTab === "reports"
                        ? "text-emerald-400 bg-white/5"
                        : "text-stone-400 hover:text-emerald-400 bg-transparent"
                    }`}
                    style={{ boxShadow: 'none' }}
                  >
                    Reports
                  </button>
                </>
              )}

              {/* Action Buttons */}
              {user ? (
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">{user.name}</div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider">{user.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-xs font-semibold text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10 cursor-pointer border-0 bg-transparent"
                    style={{ boxShadow: 'none' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleTabSelect("login")}
                  className="btn w-full mt-4 border-0"
                >
                  Hostel Mess Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
