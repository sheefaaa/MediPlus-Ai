import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/app/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <form className="panel w-full max-w-md p-8" onSubmit={handleSubmit}>
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold">Login to MediPulse AI</h1>
        <p className="mt-2 text-sm text-slate-400">Use your account to continue to the dashboard.</p>

        <div className="mt-6 space-y-4">
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
        </div>

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        <button className="button-primary mt-6 w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-400">
          No account?{" "}
          <Link to="/register" className="text-brand-300 hover:text-brand-200">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
