export interface TeamMember {
  id: string;
  name: string;
}

// ============================================================
// EDIT DI SINI: ganti nama-nama di bawah sesuai anggota tim kamu.
// - "id"   harus unik, huruf kecil, tanpa spasi (boleh pakai "_").
// - "name" adalah nama yang akan tampil di layar.
// Boleh punya 5-10 anggota.
// ============================================================
export const TEAM_MEMBERS: TeamMember[] = [
  { id: "andi", name: "Andi" },
  { id: "budi", name: "Budi" },
  { id: "citra", name: "Citra" },
  { id: "dewi", name: "Dewi" },
  { id: "eka", name: "Eka" },
  { id: "fajar", name: "Fajar" },
  { id: "gita", name: "Gita" },
  { id: "hendra", name: "Hendra" },
];
