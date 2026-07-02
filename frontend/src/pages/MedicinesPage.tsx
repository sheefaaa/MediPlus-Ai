import { useEffect, useMemo, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";

import MedicineForm from "../components/MedicineForm";
import type { Medicine } from "../lib/types";
import { formatDate } from "../lib/utils";
import { medicineService } from "../services/api";

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const data = await medicineService.list();
      setMedicines(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMedicines();
  }, []);

  const filtered = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch =
        medicine.medicine_name.toLowerCase().includes(search.toLowerCase()) ||
        medicine.category.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" ? true : medicine.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, medicines, search]);

  const handleCreate = async (payload: Omit<Medicine, "id" | "user_id" | "created_at">) => {
    await medicineService.create(payload);
    await loadMedicines();
  };

  const handleUpdate = async (payload: Omit<Medicine, "id" | "user_id" | "created_at">) => {
    if (!editing) return;
    await medicineService.update(editing.id, payload);
    setEditing(null);
    await loadMedicines();
  };

  const handleDelete = async (id: number) => {
    await medicineService.remove(id);
    await loadMedicines();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <MedicineForm initialValue={editing} onSubmit={editing ? handleUpdate : handleCreate} onCancel={editing ? () => setEditing(null) : undefined} />

        <div className="panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Medicine Management</h1>
              <p className="text-sm text-slate-400">Add, search, filter, update, and remove treatment items.</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input className="input min-w-64 pl-9" placeholder="Search medicines" value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
              <select className="input min-w-40" value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-white/5 text-left text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Medicine</th>
                  <th className="px-4 py-3 font-medium">Dosage</th>
                  <th className="px-4 py-3 font-medium">Schedule</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-slate-400" colSpan={6}>
                      Loading medicines...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-slate-400" colSpan={6}>
                      No medicines found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((medicine) => (
                    <tr key={medicine.id} className="bg-slate-950/30">
                      <td className="px-4 py-4">
                        <p className="font-medium">{medicine.medicine_name}</p>
                        <p className="text-xs text-slate-500">
                          {formatDate(medicine.start_date)}
                          {medicine.end_date ? ` to ${formatDate(medicine.end_date)}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-4">{medicine.dosage}</td>
                      <td className="px-4 py-4">
                        {medicine.frequency} · {medicine.reminder_time}
                      </td>
                      <td className="px-4 py-4">{medicine.category}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-200">
                          {medicine.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button className="button-secondary gap-2 px-3 py-2 text-xs" onClick={() => setEditing(medicine)}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>
                          <button className="button-secondary gap-2 px-3 py-2 text-xs text-rose-200" onClick={() => void handleDelete(medicine.id)}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicinesPage;
