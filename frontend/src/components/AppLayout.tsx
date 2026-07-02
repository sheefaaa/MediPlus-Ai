import { HeartPulse, LayoutDashboard, LogOut, Pill, TimerReset, UserCircle2 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { classNames } from "../lib/utils";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/medicines", label: "Medicines", icon: Pill },
  { to: "/app/reminders", label: "Reminders", icon: TimerReset },
  { to: "/app/profile", label: "Profile", icon: UserCircle2 },
];

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-4 text-slate-100 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="panel p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500/20 p-3 text-brand-300">
              <HeartPulse className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-300">MediPulse AI</p>
              <h1 className="text-xl font-semibold">Health Command Center</h1>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="mt-1 text-lg font-semibold">{user?.full_name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  classNames(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive ? "bg-brand-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button type="button" onClick={logout} className="button-secondary mt-8 w-full gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <main className="space-y-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
