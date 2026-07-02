import { motion } from "framer-motion";
import { Activity, BellRing, BrainCircuit, CalendarClock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Smart medicine management",
    description: "Organize prescriptions, dosage, categories, and notes in one clean system.",
    icon: Activity,
  },
  {
    title: "Reminder-first workflow",
    description: "Track daily, weekly, and monthly reminders with browser notifications and upcoming alerts.",
    icon: BellRing,
  },
  {
    title: "Progress analytics",
    description: "Monitor adherence, missed doses, weekly completion, and your treatment streak.",
    icon: CalendarClock,
  },
  {
    title: "Health-aware design",
    description: "Built around secure authentication, smooth dashboards, and accessible navigation.",
    icon: ShieldCheck,
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen px-4 py-5 text-slate-100 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="panel flex flex-col justify-between gap-8 p-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-300">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-300">MediPulse AI</p>
              <h1 className="text-xl font-semibold">Smart Medicine Reminder & Health Management</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="button-secondary">
              Login
            </Link>
            <Link to="/register" className="button-primary">
              Get Started
            </Link>
          </div>
        </header>

        <section className="grid gap-6 py-8 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="panel p-8 lg:p-10"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Healthcare meets clarity</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight lg:text-6xl">
              Stay on time with every dose, every reminder, and every health milestone.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              MediPulse AI helps patients, caregivers, and health-conscious users manage medicines, reminders,
              adherence, and progress through a modern full-stack health platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="button-primary">
                Create account
              </Link>
              <Link to="/login" className="button-secondary">
                Open dashboard
              </Link>
            </div>
          </motion.div>

          <div className="panel p-6">
            <div className="rounded-[2rem] border border-brand-400/20 bg-gradient-to-br from-brand-500/15 via-slate-900 to-slate-950 p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs text-brand-200">Today</span>
                <span className="text-sm text-slate-400">AI medicine info ready</span>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { title: "Metformin", time: "08:00 AM", state: "Completed" },
                  { title: "Vitamin D", time: "01:00 PM", state: "Upcoming" },
                  { title: "Amlodipine", time: "08:00 PM", state: "Scheduled" },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-slate-400">{item.time}</p>
                      </div>
                      <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-200">
                        {item.state}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon }) => (
            <div key={title} className="panel p-5">
              <div className="inline-flex rounded-2xl bg-brand-500/15 p-3 text-brand-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 py-8 lg:grid-cols-3">
          {[
            "Built for elderly users, students, office workers, clinics, and caregivers.",
            "Tracks medicine history, dashboard progress, and reminder completion trends.",
            "Designed from your project report as a polished academic and portfolio-ready app.",
          ].map((item) => (
            <div key={item} className="panel p-6 text-slate-300">
              {item}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
