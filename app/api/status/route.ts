import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { TEAM_MEMBERS } from "@/lib/team-config";

export const dynamic = "force-dynamic";

const REDIS_KEY = "papan-status-tim";
const STATUSES = ["Belum Mulai", "Dikerjakan", "Selesai"] as const;
type Status = (typeof STATUSES)[number];

interface MemberStatus {
  status: Status;
  task: string;
  updatedAt: string;
}

export async function GET() {
  const raw = (await redis.hgetall(REDIS_KEY)) as Record<string, MemberStatus> | null;

  const members = TEAM_MEMBERS.map((m) => {
    const saved = raw?.[m.id];
    return {
      id: m.id,
      name: m.name,
      status: saved?.status ?? "Belum Mulai",
      task: saved?.task ?? "",
      updatedAt: saved?.updatedAt ?? null,
    };
  });

  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const { id, status, task } = (body ?? {}) as {
    id?: string;
    status?: string;
    task?: string;
  };

  const member = TEAM_MEMBERS.find((m) => m.id === id);
  if (!member) {
    return NextResponse.json({ error: "Anggota tidak dikenal" }, { status: 400 });
  }

  if (!status || !STATUSES.includes(status as Status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  const trimmedTask = typeof task === "string" ? task.slice(0, 60) : "";

  const value: MemberStatus = {
    status: status as Status,
    task: trimmedTask,
    updatedAt: new Date().toISOString(),
  };

  await redis.hset(REDIS_KEY, { [member.id]: value });

  return NextResponse.json({ ok: true, member: { id: member.id, name: member.name, ...value } });
}
