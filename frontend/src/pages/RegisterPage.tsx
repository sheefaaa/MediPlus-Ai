import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
      });
      navigate("/app/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <form className="panel w-full max-w-2xl p-8" onSubmit={handleSubmit}>
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Start your care routine</p>
        <h1 className="mt-3 text-3xl font-semibold">Create your MediPulse AI account</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="input"
            placeholder="Full name"
            value={form.full_name}
            onChange={(event) => setForm((previous) => ({ ...previous, full_name: event.target.value }))}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))}
            required
          />
          <input
            className="input"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={(event) => setForm((previous) => ({ ...previous, age: event.target.value }))}
          />
          <select
            className="input md:col-span-2"
            value={form.gender}
            onChange={(event) => setForm((previous) => ({ ...previous, gender: event.target.value }))}
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        <button className="button-primary mt-6 w-full" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link to="/login" className="text-brand-300 hover:text-brand-200">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
