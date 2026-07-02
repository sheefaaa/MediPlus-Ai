import { useEffect, useState } from "react";

import type { Medicine, Reminder } from "../lib/types";

interface ReminderFormProps {
  medicines: Medicine[];
  initialValue?: Reminder | null;
  onSubmit: (payload: {
    medicine_id: number;
    reminder_time: string;
    schedule_type: string;
    notification_status: string;
    completed: boolean;
  }) => Promise<void>;
  onCancel?: () => void;
}

const buildInitial = () => ({
  medicine_id: 0,
  reminder_time: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
  schedule_type: "daily",
  notification_status: "pending",
  completed: false,
});

const ReminderForm = ({ medicines, initialValue, onSubmit, onCancel }: ReminderFormProps) => {
  const [form, setForm] = useState(buildInitial());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        medicine_id: initialValue.medicine_id,
        reminder_time: initialValue.reminder_time.slice(0, 16),
        schedule_type: initialValue.schedule_type,
        notification_status: initialValue.notification_status,
        completed: initialValue.completed,
      });
    } else if (medicines[0]) {
      setForm((previous) => ({ ...previous, medicine_id: medicines[0].id }));
    }
  }, [initialValue, medicines]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        reminder_time: new Date(form.reminder_time).toISOString(),
      });
      if (!initialValue) {
        setForm({ ...buildInitial(), medicine_id: medicines[0]?.id ?? 0 });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel p-5" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{initialValue ? "Edit Reminder" : "New Reminder"}</h3>
          <p className="text-sm text-slate-400">Schedule browser-based medicine alerts.</p>
        </div>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="button-secondary">
            Cancel
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <select
          className="input"
          value={form.medicine_id}
          onChange={(event) => setForm((previous) => ({ ...previous, medicine_id: Number(event.target.value) }))}
          required
        >
          {medicines.map((medicine) => (
            <option key={medicine.id} value={medicine.id}>
              {medicine.medicine_name}
            </option>
          ))}
        </select>
        <input
          className="input"
          type="datetime-local"
          value={form.reminder_time}
          onChange={(event) => setForm((previous) => ({ ...previous, reminder_time: event.target.value }))}
          required
        />
        <select
          className="input"
          value={form.schedule_type}
          onChange={(event) => setForm((previous) => ({ ...previous, schedule_type: event.target.value }))}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <select
          className="input"
          value={form.notification_status}
          onChange={(event) => setForm((previous) => ({ ...previous, notification_status: event.target.value }))}
        >
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      <label className="mt-4 flex items-center gap-3 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={form.completed}
          onChange={(event) => setForm((previous) => ({ ...previous, completed: event.target.checked }))}
        />
        Mark as completed
      </label>

      <button type="submit" className="button-primary mt-6" disabled={submitting || medicines.length === 0}>
        {submitting ? "Saving..." : initialValue ? "Update Reminder" : "Create Reminder"}
      </button>
    </form>
  );
};

export default ReminderForm;
