import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}

const StatCard = ({ title, value, description, icon }: StatCardProps) => (
  <div className="panel p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="mt-3 text-3xl font-semibold">{value}</p>
      </div>
      <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-300">{icon}</div>
    </div>
    <p className="mt-4 text-sm text-slate-400">{description}</p>
  </div>
);

export default StatCard;
