import { useEffect, useState } from "react";
import { CheckCircle2, Pencil, Trash2 } from "lucide-react";

import ReminderForm from "../components/ReminderForm";
import type { Medicine, Reminder } from "../lib/types";
import { formatDateTime } from "../lib/utils";
import { medicineService, reminderService } from "../services/api";

const RemindersPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [medicineData, reminderData] = await Promise.all([medicineService.list(), reminderService.list()]);
      setMedicines(medicineData);
      setReminders(reminderData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreate = async (payload: {
    medicine_id: number;
    reminder_time: string;
    schedule_type: string;
    notification_status: string;
    completed: boolean;
  }) => {
    await reminderService.create(payload);
    await loadData();
  };

  const handleUpdate = async (payload: {
    medicine_id: number;
    reminder_time: string;
    schedule_type: string;
    notification_status: string;
    completed: boolean;
  }) => {
    if (!editing) return;
    await reminderService.update(editing.id, payload);
    setEditing(null);
    await loadData();
  };

  const markCompleted = async (reminder: Reminder) => {
    await reminderService.update(reminder.id, { completed: !reminder.completed, notification_status: "sent" });
    await loadData();
  };

  const removeReminder = async (id: number) => {
    await reminderService.remove(id);
    await loadData();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <ReminderForm medicines={medicines} initialValue={editing} onSubmit={editing ? handleUpdate : handleCreate} onCancel={editing ? () => setEditing(null) : undefined} />

        <div className="panel p-5">
          <h1 className="text-2xl font-semibold">Reminder Center</h1>
          <p className="mt-1 text-sm text-slate-400">Track daily medicine alerts and mark reminders as completed.</p>

          <div className="mt-6 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-400">Loading reminders...</p>
            ) : reminders.length === 0 ? (
              <p className="text-sm text-slate-400">No reminders created yet.</p>
            ) : (
              reminders.map((reminder) => (
                <div key={reminder.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-semibold">{reminder.medicine_name ?? "Medicine reminder"}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatDateTime(reminder.reminder_time)} · {reminder.schedule_type}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Status: {reminder.completed ? "Completed" : reminder.notification_status}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button className="button-secondary gap-2 px-3 py-2 text-xs" onClick={() => void markCompleted(reminder)}>
                        <CheckCircle2 className="h-4 w-4" />
                        {reminder.completed ? "Undo" : "Complete"}
                      </button>
                      <button className="button-secondary gap-2 px-3 py-2 text-xs" onClick={() => setEditing(reminder)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button className="button-secondary gap-2 px-3 py-2 text-xs text-rose-200" onClick={() => void removeReminder(reminder.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersPage;
