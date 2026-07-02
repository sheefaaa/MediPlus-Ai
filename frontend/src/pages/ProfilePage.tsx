import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name ?? "",
    age: user?.age?.toString() ?? "",
    gender: user?.gender ?? "",
    avatar_url: user?.avatar_url ?? "",
    notification_enabled: user?.notification_enabled ?? true,
    theme: user?.theme ?? "system",
    current_password: "",
    new_password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const updated = await authService.updateProfile({
        full_name: form.full_name,
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        avatar_url: form.avatar_url || null,
        notification_enabled: form.notification_enabled,
        theme: form.theme,
        current_password: form.current_password || undefined,
        new_password: form.new_password || undefined,
      });
      updateUser(updated);
      setForm((previous) => ({ ...previous, current_password: "", new_password: "" }));
      setMessage("Profile updated successfully.");
    } catch (error: any) {
      setMessage(error?.response?.data?.detail ?? "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="panel p-6" onSubmit={handleSubmit}>
      <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Profile</p>
      <h1 className="mt-3 text-3xl font-semibold">Personal settings</h1>
      <p className="mt-2 text-sm text-slate-400">Update personal details, notifications, theme, and password.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input className="input" placeholder="Full name" value={form.full_name} onChange={(event) => setForm((previous) => ({ ...previous, full_name: event.target.value }))} />
        <input className="input" type="number" placeholder="Age" value={form.age} onChange={(event) => setForm((previous) => ({ ...previous, age: event.target.value }))} />
        <select className="input" value={form.gender} onChange={(event) => setForm((previous) => ({ ...previous, gender: event.target.value }))}>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input className="input" placeholder="Avatar URL" value={form.avatar_url} onChange={(event) => setForm((previous) => ({ ...previous, avatar_url: event.target.value }))} />
        <select className="input" value={form.theme} onChange={(event) => setForm((previous) => ({ ...previous, theme: event.target.value }))}>
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.notification_enabled}
            onChange={(event) => setForm((previous) => ({ ...previous, notification_enabled: event.target.checked }))}
          />
          Enable browser notifications
        </label>
        <input
          className="input"
          type="password"
          placeholder="Current password"
          value={form.current_password}
          onChange={(event) => setForm((previous) => ({ ...previous, current_password: event.target.value }))}
        />
        <input
          className="input"
          type="password"
          placeholder="New password"
          value={form.new_password}
          onChange={(event) => setForm((previous) => ({ ...previous, new_password: event.target.value }))}
        />
      </div>

      {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}

      <button className="button-primary mt-6" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
};

export default ProfilePage;
