"use client";

import { useEffect, useState, type FormEvent } from "react";
import { USER_ROLES, type UserRole } from "@/lib/auth/profile";
import Alert from "@/components/admin/ui/Alert";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/form/Input";
import Select from "@/components/admin/form/Select";

type CreateUserModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateUserModal({ open, onClose, onCreated }: CreateUserModalProps) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [isVerified, setIsVerified] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setEmail("");
    setFullName("");
    setPassword("");
    setRole("user");
    setIsVerified(true);
    setError(null);
  }, [open]);

  if (!open) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName, role, isVerified }),
    });
    const payload = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(payload.error ?? "Could not create user");
      return;
    }
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-brand-900/40"
        onClick={pending ? undefined : onClose}
        disabled={pending}
      />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-user-title"
        onSubmit={(event) => void submit(event)}
        className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-lg"
      >
        <h2 id="create-user-title" className="text-lg font-bold tracking-tight text-brand-800">
          Add user
        </h2>
        <p className="mt-2 text-sm text-gray-600">They can sign in with this email and password.</p>
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-semibold text-brand-800" htmlFor="create-user-name">
            Name
            <span className="ml-1 font-normal text-gray-400">optional</span>
            <div className="mt-1.5 font-normal">
              <Input id="create-user-name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Ada" disabled={pending} />
            </div>
          </label>
          <label className="block text-sm font-semibold text-brand-800" htmlFor="create-user-email">
            Email
            <div className="mt-1.5 font-normal">
              <Input
                id="create-user-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@example.com"
                disabled={pending}
              />
            </div>
          </label>
          <label className="block text-sm font-semibold text-brand-800" htmlFor="create-user-password">
            Password
            <div className="mt-1.5 font-normal">
              <Input
                id="create-user-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                disabled={pending}
              />
            </div>
          </label>
          <label className="block text-sm font-semibold text-brand-800" htmlFor="create-user-role">
            Role
            <div className="mt-1.5 font-normal">
              <Select
                id="create-user-role"
                value={role}
                onChange={(value) => setRole(value as UserRole)}
                placeholder=""
                disabled={pending}
                options={USER_ROLES.map((option) => ({ value: option, label: option }))}
              />
            </div>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-brand-800">
            <input type="checkbox" checked={isVerified} onChange={(event) => setIsVerified(event.target.checked)} disabled={pending} />
            Verify now so they can sign in without an email link
          </label>
        </div>
        {error ? (
          <div className="mt-4">
            <Alert variant="error" title="Could not add user" message={error} />
          </div>
        ) : null}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={pending || !email.trim() || password.length < 8}>
            {pending ? "Adding…" : "Add user"}
          </Button>
        </div>
      </form>
    </div>
  );
}
