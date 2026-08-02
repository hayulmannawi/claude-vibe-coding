# Papan Status Tim

Aplikasi web sederhana untuk melihat status kerja anggota tim secara sekilas:
siapa **Belum Mulai**, siapa **Dikerjakan**, siapa **Selesai** — beserta tugas
singkat yang sedang dikerjakan dan kapan terakhir diubah.

Setiap orang cukup memilih namanya sekali dari daftar, lalu bisa mengubah
barisnya sendiri kapan saja dari HP atau laptop. Semua orang bisa melihat
semua baris tanpa login.

## Cara kerja singkat

- Daftar nama anggota tim ditulis manual di `lib/team-config.ts` (bukan dari UI).
- Status & tugas tersimpan di database Redis (Upstash), yang gratis untuk
  skala kecil dan paling cepat disetel di Vercel.
- Layar memperbarui data otomatis setiap 5 detik (near real-time), dan ada
  tombol "Perbarui" untuk memperbarui manual.
- Siapa "aku" ditentukan lewat pilihan nama yang disimpan di browser
  (localStorage) — bukan sistem akun/password.

## 1. Edit daftar nama tim kamu

Buka file `lib/team-config.ts` dan ganti nama-nama contoh dengan nama tim
kamu sendiri (5-10 orang):

```ts
export const TEAM_MEMBERS: TeamMember[] = [
  { id: "andi", name: "Andi" },
  { id: "budi", name: "Budi" },
  // tambah/ganti sesuai tim kamu...
];
```

- `id`: pengenal unik, huruf kecil tanpa spasi (contoh: `siti`, `budi_s`).
- `name`: nama yang tampil di layar.

Simpan, commit, lalu push — perubahan ini akan otomatis ter-deploy ulang di
Vercel (lihat langkah 4).

## 2. Push project ini ke GitHub

Jika belum, buat repository baru di GitHub lalu push kode ini ke sana.

## 3. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login (bisa pakai akun GitHub).
2. Klik **Add New… → Project**, lalu pilih repository ini.
3. Framework akan otomatis terdeteksi sebagai **Next.js** — biarkan
   pengaturan default, klik **Deploy**.
4. Deploy pertama ini kemungkinan **gagal atau error saat memuat data**,
   itu wajar — karena database belum dihubungkan. Lanjut ke langkah 4.

## 4. Tambahkan database (Upstash Redis via Vercel Marketplace)

1. Di dashboard project kamu di Vercel, buka tab **Storage**.
2. Klik **Create Database**, pilih **Upstash** → **Redis** (paket gratis /
   *Free* cukup untuk tim 5-10 orang).
3. Beri nama bebas (misalnya `papan-status-tim-db`), pilih region terdekat
   (misalnya Singapore), lalu buat.
4. Setelah dibuat, klik **Connect Project** dan pilih project "Papan Status
   Tim" kamu, lalu hubungkan ke environment **Production** (dan
   **Preview**/**Development** juga jika muncul pilihannya).
5. Langkah ini akan otomatis menambahkan environment variable berikut ke
   project kamu:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - (beberapa variabel lain mungkin ikut ditambahkan, tidak masalah — yang
     dipakai aplikasi ini hanya dua di atas)

Kamu bisa cek variabel ini di **Settings → Environment Variables**.

## 5. Deploy ulang

Setelah database terhubung, buka tab **Deployments**, klik titik tiga (⋯)
pada deployment terakhir, lalu pilih **Redeploy**. Setelah selesai, buka
URL project kamu (contoh: `papan-status-tim.vercel.app`) — aplikasi siap
dipakai.

## 6. Bagikan link ke tim

Kirim link Vercel-nya lewat WhatsApp ke tim kamu. Setiap orang buka sekali,
pilih namanya masing-masing dari daftar, lalu bisa langsung dipakai.
Browser akan mengingat pilihan nama itu, jadi tidak perlu pilih ulang tiap
buka — kecuali mereka ganti browser/HP, atau menekan "Bukan kamu?" di
layar.

## Menjalankan di komputer sendiri (opsional)

```bash
npm install
cp .env.example .env.local
# isi KV_REST_API_URL dan KV_REST_API_TOKEN di .env.local
# (ambil nilainya dari Settings → Environment Variables di Vercel)
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Batasan yang disengaja (versi pertama)

- Tidak ada tambah/hapus anggota dari UI — edit `lib/team-config.ts` lalu
  push untuk mengubah daftar tim.
- Satu orang hanya punya satu status & satu tugas aktif.
- Tidak ada riwayat status sebelumnya, notifikasi, atau integrasi WhatsApp.
- "Siapa aku" berbasis pilihan nama tersimpan di browser (localStorage),
  bukan login berbasis password — cukup untuk tim kecil yang saling
  percaya.
