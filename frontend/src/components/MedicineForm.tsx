import { useEffect, useState } from "react";

import type { Medicine } from "../lib/types";

interface MedicineFormProps {
  initialValue?: Partial<Medicine> | null;
  onSubmit: (payload: Omit<Medicine, "id" | "user_id" | "created_at">) => Promise<void>;
  onCancel?: () => void;
}

const emptyState = {
  medicine_name: "",
  dosage: "",
  frequency: "Daily",
  start_date: new Date().toISOString().slice(0, 10),
  end_date: "",
  reminder_time: "08:00",
  category: "General",
  notes: "",
  status: "active",
};

const MedicineForm = ({ initialValue, onSubmit, onCancel }: MedicineFormProps) => {
  const [form, setForm] = useState(emptyState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initialValue) {
      setForm(emptyState);
      return;
    }
    setForm({
      medicine_name: initialValue.medicine_name ?? "",
      dosage: initialValue.dosage ?? "",
      frequency: initialValue.frequency ?? "Daily",
      start_date: initialValue.start_date ?? emptyState.start_date,
      end_date: initialValue.end_date ?? "",
      reminder_time: initialValue.reminder_time ?? "08:00",
      category: initialValue.category ?? "General",
      notes: initialValue.notes ?? "",
      status: initialValue.status ?? "active",
    });
  }, [initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        end_date: form.end_date || null,
        notes: form.notes || null,
      });
      if (!initialValue) {
        setForm(emptyState);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel p-5" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{initialValue?.id ? "Edit Medicine" : "Add Medicine"}</h3>
          <p className="text-sm text-slate-400">Manage dosage, timing, and treatment details.</p>
        </div>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="button-secondary">
            Cancel
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input className="input" name="medicine_name" placeholder="Medicine name" value={form.medicine_name} onChange={handleChange} required />
        <input className="input" name="dosage" placeholder="Dosage" value={form.dosage} onChange={handleChange} required />
        <input className="input" name="frequency" placeholder="Frequency" value={form.frequency} onChange={handleChange} required />
        <input className="input" type="time" name="reminder_time" value={form.reminder_time} onChange={handleChange} required />
        <input className="input" type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
        <input className="input" type="date" name="end_date" value={form.end_date} onChange={handleChange} />
        <input className="input" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <select className="input" name="status" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
        <textarea className="input md:col-span-2" rows={4} name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
      </div>

      <button type="submit" className="button-primary mt-6" disabled={submitting}>
        {submitting ? "Saving..." : initialValue?.id ? "Update Medicine" : "Create Medicine"}
      </button>
    </form>
  );
};

export default MedicineForm;
