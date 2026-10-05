"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import CreateUserModal from "@/components/admin/CreateUserModal";
import Select from "@/components/admin/form/Select";
import Input from "@/components/admin/form/Input";
import Alert from "@/components/admin/ui/Alert";
import Badge from "@/components/admin/ui/Badge";
import Button from "@/components/admin/ui/Button";
import RefreshButton from "@/components/admin/ui/RefreshButton";
import SortableTh from "@/components/admin/ui/SortableTh";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/admin/ui/Table";
import TableSkeleton from "@/components/admin/ui/TableSkeleton";
import { USER_ROLES, type Profile, type UserRole } from "@/lib/auth/profile";

type UsersResponse = {
  users: Profile[];
  error?: string;
};

type SortKey = "name" | "email" | "role" | "status" | "created";

function roleColor(role: UserRole) {
  if (role === "admin") return "primary" as const;
  if (role === "agent") return "info" as const;
  return "light" as const;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AdminUsersPage() {
  const { profile, loading: authLoading, openLogin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [role, setRole] = useState("");
  const [verified, setVerified] = useState("");
  const [limit, setLimit] = useState("25");
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [listLoading, setListLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(handle);
  }, [query]);

  const load = useCallback(async () => {
    setListLoading(true);
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (role) params.set("role", role);
    if (verified) params.set("verified", verified);
    const response = await fetch(`/api/admin/users?${params.toString()}`);
    const payload = (await response.json()) as UsersResponse;
    if (!response.ok) {
      setError(payload.error ?? "Could not load users");
      setListLoading(false);
      return;
    }
    setError(null);
    setUsers(payload.users);
    setOffset(0);
    setListLoading(false);
  }, [debouncedQuery, role, verified]);

  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      openLogin();
      return;
    }
    if (profile.role !== "admin") router.replace("/");
  }, [authLoading, profile, openLogin, router]);

  useEffect(() => {
    if (authLoading || !isAdmin) return;
    void load();
  }, [authLoading, isAdmin, load]);

  const sorted = useMemo(() => {
    const copy = [...users];
    copy.sort((a, b) => {
      const direction = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "name") return (a.full_name ?? "").localeCompare(b.full_name ?? "") * direction;
      if (sortBy === "email") return a.email.localeCompare(b.email) * direction;
      if (sortBy === "role") return a.role.localeCompare(b.role) * direction;
      if (sortBy === "status") return (Number(a.is_verified) - Number(b.is_verified)) * direction;
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * direction;
    });
    return copy;
  }, [users, sortBy, sortOrder]);

  const pageSize = Number(limit) || 25;
  const pageRows = sorted.slice(offset, offset + pageSize);
  const canPrev = offset > 0;
  const canNext = offset + pageSize < sorted.length;

  const updateUser = async (id: string, patch: { role?: UserRole; isVerified?: boolean }) => {
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Update failed");
      return;
    }
    setNotice("");
    await load();
  };

  const handleSort = (column: string) => {
    const key = column as SortKey;
    setSortOrder(sortBy === key && sortOrder === "desc" ? "asc" : "desc");
    setSortBy(key);
    setOffset(0);
  };

  if (authLoading || !profile || profile.role !== "admin") {
    return <div className="text-sm text-gray-500">Checking access…</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-800">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Search matches name or email. Change a role or verification from the row.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <RefreshButton loading={listLoading} onClick={() => void load()} />
          <Button
            size="sm"
            startIcon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            }
            onClick={() => setCreating(true)}
          >
            Add user
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
          <div className="w-52">
            <Input type="search" placeholder="Search name or email" value={query} onChange={(event) => setQuery(event.target.value)} className="!h-9 !py-0" />
          </div>
          <div className="w-32">
            <Select
              value={role}
              onChange={setRole}
              placeholder="All roles"
              className="!h-9 !py-0"
              options={USER_ROLES.map((option) => ({ value: option, label: option }))}
            />
          </div>
          <div className="w-36">
            <Select
              value={verified}
              onChange={setVerified}
              placeholder="Any status"
              className="!h-9 !py-0"
              options={[
                { value: "true", label: "Verified" },
                { value: "false", label: "Pending" },
              ]}
            />
          </div>
          <div className="w-28">
            <Select
              value={limit}
              onChange={(value) => {
                setLimit(value);
                setOffset(0);
              }}
              placeholder=""
              className="!h-9 !py-0"
              options={[
                { value: "10", label: "10" },
                { value: "25", label: "25" },
                { value: "50", label: "50" },
                { value: "100", label: "100" },
              ]}
            />
          </div>
      </div>

      {notice ? <Alert variant="success" title="User added" message={notice} /> : null}
      {error ? <Alert variant="error" title="Error" message={error} /> : null}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
          {listLoading ? (
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          ) : (
            <p className="text-sm font-semibold text-brand-800">
              {`Showing ${pageRows.length} of ${sorted.length} user${sorted.length === 1 ? "" : "s"}`}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={!canPrev || listLoading} onClick={() => setOffset((current) => Math.max(0, current - pageSize))}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!canNext || listLoading} onClick={() => setOffset((current) => current + pageSize)}>
              Next
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTh label="Name" column="name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableTh label="Email" column="email" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableTh label="Role" column="role" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableTh label="Status" column="status" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableTh label="Created" column="created" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listLoading ? (
              <TableSkeleton columns={6} />
            ) : pageRows.length === 0 ? (
              <TableRow>
                <TableCell className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50/80">
                  <TableCell>
                    <div className="font-semibold text-brand-800">{row.full_name || "—"}</div>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge color={roleColor(row.role)} size="sm">
                        {row.role}
                      </Badge>
                      <div className="w-28">
                        <Select
                          value={row.role}
                          onChange={(value) => void updateUser(row.id, { role: value as UserRole })}
                          placeholder=""
                          className="!h-8 !py-0"
                          options={USER_ROLES.map((option) => ({ value: option, label: option }))}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color={row.is_verified ? "success" : "warning"} size="sm">
                      {row.is_verified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(row.created_at)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => void updateUser(row.id, { isVerified: !row.is_verified })}>
                      {row.is_verified ? "Mark pending" : "Verify"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateUserModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={() => {
          setNotice("The account is ready to sign in.");
          void load();
        }}
      />
    </div>
  );
}
