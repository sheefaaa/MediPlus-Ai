import { useEffect, useState } from "react";
import { Activity, BellDot, CalendarCheck2, HeartPulse } from "lucide-react";

import ChartBars from "../components/ChartBars";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import type { AnalyticsData, DashboardData, Reminder, StatisticsData } from "../lib/types";
import { formatDateTime } from "../lib/utils";
import { analyticsService, reminderService } from "../services/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashboardData, analyticsData, statsData, reminderData] = await Promise.all([
        analyticsService.dashboard(),
        analyticsService.analytics(),
        analyticsService.statistics(),
        reminderService.list(),
      ]);
      setDashboard(dashboardData);
      setAnalytics(analyticsData);
      setStatistics(statsData);
      setReminders(reminderData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useNotifications(reminders, Boolean(user?.notification_enabled));

  if (loading || !dashboard || !analytics || !statistics) {
    return <div className="panel p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4">
      <section className="panel p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Dashboard</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Welcome, {user?.full_name}</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Track your medicine routine, upcoming reminders, and treatment consistency from one place.
            </p>
          </div>
          <button onClick={() => void loadData()} className="button-secondary">
            Refresh dashboard
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today's medicines" value={dashboard.today_count} description="Scheduled medicine entries for today." icon={<CalendarCheck2 className="h-6 w-6" />} />
        <StatCard title="Upcoming reminders" value={dashboard.upcoming_count} description="Reminders within the next 24 hours." icon={<BellDot className="h-6 w-6" />} />
        <StatCard title="Completion rate" value={`${dashboard.completion_rate}%`} description="Overall reminder adherence." icon={<Activity className="h-6 w-6" />} />
        <StatCard title="Active medicines" value={dashboard.active_medicines} description="Currently active treatment items." icon={<HeartPulse className="h-6 w-6" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartBars title="Weekly progress" subtitle="Reminder completion percentage over the last 7 days." data={analytics.weekly_chart} />

        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="mt-5 space-y-4">
            {[
              { label: "Missed reminders", value: analytics.missed_count },
              { label: "Adherence streak", value: `${analytics.streak_counter} day(s)` },
              { label: "Total reminders", value: statistics.reminders },
              { label: "Completed reminders", value: statistics.completed_reminders },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Today's medicines</h3>
          <div className="mt-5 space-y-3">
            {dashboard.today_medicines.length === 0 ? (
              <p className="text-sm text-slate-400">No medicines scheduled for today yet.</p>
            ) : (
              dashboard.today_medicines.map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.medicine_name}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.dosage} · {item.category} · {item.reminder_time}
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-200">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Upcoming reminders</h3>
          <div className="mt-5 space-y-3">
            {dashboard.upcoming_reminders.length === 0 ? (
              <p className="text-sm text-slate-400">No upcoming reminders in the next 24 hours.</p>
            ) : (
              dashboard.upcoming_reminders.map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.medicine_name}</p>
                      <p className="mt-1 text-sm text-slate-400">{formatDateTime(item.reminder_time)}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                      {item.schedule_type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <ChartBars title="Monthly pattern" subtitle="Rolling weekly completion blocks for the last month." data={analytics.monthly_chart} />
    </div>
  );
};

export default DashboardPage;
