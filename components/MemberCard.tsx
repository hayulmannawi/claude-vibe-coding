"use client";

import { useState } from "react";
import type { Member } from "./TeamBoard";
import { formatRelativeTime } from "@/lib/time";

const STATUS_OPTIONS: Member["status"][] = ["Belum Mulai", "Dikerjakan", "Selesai"];

const STATUS_STYLES: Record<Member["status"], string> = {
  "Belum Mulai": "status-red",
  Dikerjakan: "status-yellow",
  Selesai: "status-green",
};

export default function MemberCard({
  member,
  isMine,
  onSaved,
}: {
  member: Member;
  isMine: boolean;
  onSaved: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<Member["status"]>(member.status);
  const [task, setTask] = useState(member.task);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const startEditing = () => {
    setStatus(member.status);
    setTask(member.task);
    setSaveError(null);
    setIsEditing(true);
  };

  const save = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, status, task }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setIsEditing(false);
      onSaved();
    } catch {
      setSaveError("Gagal menyimpan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`member-card ${isMine ? "member-card-mine" : ""}`}>
      <div className="member-card-top">
        <span className="member-name">{member.name}</span>
        <span className={`status-badge ${STATUS_STYLES[member.status]}`}>{member.status}</span>
      </div>
      <p className="member-task">{member.task || "Belum ada tugas"}</p>
      <p className="member-time">{formatRelativeTime(member.updatedAt)}</p>

      {isMine && !isEditing && (
        <button type="button" className="btn-edit" onClick={startEditing}>
          Ubah status saya
        </button>
      )}

      {isMine && isEditing && (
        <div className="edit-form">
          <div className="status-options">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`status-option ${STATUS_STYLES[option]} ${
                  status === option ? "status-option-selected" : ""
                }`}
                onClick={() => setStatus(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <input
            className="task-input"
            type="text"
            maxLength={60}
            placeholder="Tugas singkat (contoh: Desain banner klien X)"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          {saveError && <p className="board-error">{saveError}</p>}

          <div className="edit-actions">
            <button type="button" className="btn-save" onClick={save} disabled={isSaving}>
              {isSaving ? "Menyimpan…" : "Simpan"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
