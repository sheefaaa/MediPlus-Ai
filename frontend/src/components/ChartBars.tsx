interface ChartBarsProps {
  title: string;
  subtitle: string;
  data: Array<{ label: string; value: number }>;
}

const ChartBars = ({ title, subtitle, data }: ChartBarsProps) => (
  <div className="panel p-5">
    <div className="flex items-end justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>

    <div className="mt-6 flex h-52 items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
          <div className="flex h-40 w-full items-end rounded-3xl bg-white/5 p-2">
            <div
              className="w-full rounded-2xl bg-gradient-to-t from-brand-600 to-brand-300"
              style={{ height: `${Math.max(item.value, 8)}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">{item.label}</p>
            <p className="text-sm font-semibold">{item.value}%</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ChartBars;
