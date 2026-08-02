"use client";

import { useCallback, useEffect, useState } from "react";
import MemberCard from "./MemberCard";

export interface Member {
  id: string;
  name: string;
  status: "Belum Mulai" | "Dikerjakan" | "Selesai";
  task: string;
  updatedAt: string | null;
}

const POLL_INTERVAL_MS = 5000;

export default function TeamBoard({
  myId,
  onChangeName,
}: {
  myId: string;
  onChangeName: () => void;
}) {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMembers = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data");
      const data = await res.json();
      setMembers(data.members);
      setError(null);
    } catch {
      setError("Gagal memuat data. Coba tekan tombol perbarui.");
    } finally {
      if (showSpinner) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
    const interval = setInterval(() => fetchMembers(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchMembers]);

  const myName = members?.find((m) => m.id === myId)?.name ?? "";

  return (
    <main className="board">
      <header className="board-header">
        <h1 className="app-title">Papan Status Tim</h1>
        <button
          type="button"
          className="btn-refresh"
          onClick={() => fetchMembers(true)}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Memperbarui…" : "Perbarui"}
        </button>
      </header>

      {myName && (
        <p className="whoami">
          Kamu login sebagai <strong>{myName}</strong>.{" "}
          <button type="button" className="link-button" onClick={onChangeName}>
            Bukan kamu?
          </button>
        </p>
      )}

      {error && <p className="board-error">{error}</p>}

      {!members ? (
        <p className="board-loading">Memuat…</p>
      ) : (
        <ul className="member-list">
          {members.map((member) => (
            <li key={member.id}>
              <MemberCard member={member} isMine={member.id === myId} onSaved={fetchMembers} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
