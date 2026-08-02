"use client";

import { TEAM_MEMBERS } from "@/lib/team-config";

export default function NamePicker({ onPick }: { onPick: (id: string) => void }) {
  return (
    <main className="name-picker">
      <h1 className="app-title">Papan Status Tim</h1>
      <p className="name-picker-subtitle">Pilih nama kamu untuk mulai</p>
      <div className="name-picker-list">
        {TEAM_MEMBERS.map((member) => (
          <button
            key={member.id}
            type="button"
            className="name-picker-button"
            onClick={() => onPick(member.id)}
          >
            {member.name}
          </button>
        ))}
      </div>
    </main>
  );
}
