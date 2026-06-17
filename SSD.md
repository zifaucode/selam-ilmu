# SSD (System Design Document)

# Portal Pengetahuan Peradaban, Spiritualitas, Ketuhanan, Budaya, Kitab, dan Filsafat

Version: 1.0

Status: Draft Awal

---

# 1. Gambaran Umum Sistem

## Nama Proyek

Portal Pengetahuan Peradaban

## Deskripsi

Portal Pengetahuan Peradaban merupakan website ensiklopedia digital yang berfokus pada penyebaran pengetahuan lintas disiplin yang mencakup:

- Peradaban
- Spiritualitas
- Ketuhanan
- Budaya dan Adat
- Kitab-Kitab
- Filsafat
- Tokoh dan Pemikir
- Glosarium Istilah

Website dirancang sebagai knowledge base statis yang cepat, ringan, mudah dipelihara, dan tidak memerlukan database.

---

# 2. Tujuan Sistem

## Tujuan Utama

Membangun perpustakaan digital yang:

- Ringan
- Cepat
- SEO Friendly
- Mudah dikelola
- Mudah dikembangkan
- Mudah di-backup

## Target Pengguna

- Pelajar
- Mahasiswa
- Peneliti
- Guru dan Dosen
- Penggiat Budaya
- Penggiat Spiritualitas
- Pembaca Umum

---

# 3. Arsitektur Sistem

## Pendekatan

Static Site Architecture

Tidak menggunakan:

- Database
- Backend API
- Dashboard Admin
- Sistem Login

## Diagram Arsitektur

Browser
↓
Astro Frontend
↓
Markdown Content Collections
↓
JSON Metadata
↓
Cloudflare Pages

---

# 4. Teknologi Utama

## Frontend

- Astro
- TypeScript
- TailwindCSS

## Content Management

- Markdown (.md)
- Astro Content Collections

## Metadata

- JSON

## Search

- Fuse.js

## Deployment

- GitHub
- Cloudflare Pages

## Version Control

- Git

---

# 5. Alasan Tidak Menggunakan Database

Konten website bersifat:

- Jarang berubah
- Tidak memerlukan transaksi
- Tidak memerlukan autentikasi
- Tidak memerlukan relasi kompleks

Keuntungan:

- Lebih cepat
- Lebih murah
- Lebih aman
- Backup lebih mudah
- Maintenance lebih sederhana

---

# 6. Struktur Konten

## Kategori Utama

### PILAR I: Domain Pemikiran (Konsep & Ide)

#### Filsafat
Contoh:
- Stoikisme
- Platonisme
- Eksistensialisme

#### Spiritualitas
Contoh:
- Tasawuf
- Zen
- Meditasi

#### Ketuhanan
Contoh:
- Tauhid
- Monoteisme
- Panteisme

### PILAR II: Konteks Ruang & Waktu (Sejarah)

#### Peradaban
Contoh:
- Mesopotamia
- Mesir Kuno
- Yunani Kuno

#### Budaya dan Adat
Contoh:
- Sunda
- Jawa
- Bugis

### PILAR III: Entitas Sumber (Aktor & Literatur)

#### Tokoh
Contoh:
- Plato
- Aristoteles
- Al-Ghazali

#### Pustaka & Literatur
Contoh:
- Kitab Suci: Al-Qur'an, Weda
- Naskah Kuno: La Galigo, Negarakertagama
- Buku Klasik: Republic, Ihya Ulumuddin

### PILAR IV: Referensi Cepat

#### Glosarium
Contoh:
- Esensi
- Substansi
- Logos

---

# 7. Struktur Folder

project/

├── public/
│
├── src/
│
├── content/
│
│ ├── civilizations/
│ │
│ ├── spirituality/
│ │
│ ├── theology/
│ │
│ ├── cultures/
│ │
│ ├── literatures/
│ │
│ ├── philosophy/
│ │
│ ├── figures/
│ │
│ ├── glossary/
│ │
│ └── timelines/
│
├── components/
│
├── layouts/
│
├── pages/
│
├── services/
│
├── utils/
│
└── styles/

---

# 8. Struktur Artikel

## Format Markdown

File:

content/philosophy/plato.md

Contoh:

---

title: Plato

slug: plato

category: philosophy

tags:

- filsafat
- yunani
- platonisme

summary: Filsuf Yunani pendiri Akademia.

author: Admin

## createdAt: 2026-01-01

# Plato

Isi artikel di sini.

## Latar Belakang

...

## Pemikiran

...

## Pengaruh

...

---

# 9. Struktur Metadata JSON

Metadata tambahan digunakan untuk:

- Relasi artikel
- Timeline
- Referensi silang
- Knowledge Graph

Contoh:

{
"id": "plato",
"related": [
"socrates",
"aristotle",
"platonism"
]
}

---

# 10. Struktur Literatur

Pustaka/Literatur dapat memiliki struktur hierarki untuk menangani bab atau surah.

Contoh:

content/

├── literatures/
│
├── quran/
│ ├── al-fatihah.md
│ ├── al-baqarah.md
│ └── ali-imran.md
│
├── republic/
│ ├── book-1.md
│ ├── book-2.md
│
└── lagaligo/
├── episode-1.md
├── episode-2.md

---

# 11. Data Import

## Sumber Data

Data dapat berasal dari:

- API
- CSV
- Excel
- JSON
- XML

## Proses

API
↓
Script Converter
↓
Markdown Generator
↓
Content Collections
↓
Build Astro

Contoh:

API Al-Qur'an
↓
JSON
↓
Generate Markdown
↓
content/quran/al-fatihah.md

---

# 12. Pencarian

Menggunakan:

Fuse.js

Pencarian mencakup:

- Judul
- Isi Artikel
- Tag
- Nama Tokoh
- Nama Kitab
- Istilah

Contoh:

Keyword:

tauhid

Hasil:

- Tauhid
- Tasawuf
- Ibn Arabi
- Wahdatul Wujud

---

# 13. SEO

Setiap halaman wajib memiliki:

- Title
- Description
- Open Graph
- Canonical URL
- Sitemap

Target SEO:

- Google Friendly
- Bing Friendly
- AI Search Friendly

---

# 14. Backup Strategy

## Backup Primer

Git Repository

GitHub

## Backup Sekunder

Clone Repository Lokal

## Backup Tersier

Export ZIP Bulanan

Alur:

Laptop
↓
GitHub
↓
Cloudflare Pages

Keuntungan:

- Versioning
- Audit Trail
- Rollback
- Disaster Recovery

---

# 15. Deployment Flow

Developer
↓
Git Commit
↓
Git Push
↓
GitHub
↓
Cloudflare Pages
↓
Production

Deployment dilakukan otomatis setiap push ke branch:

main

---

# 16. Roadmap

## V1

- Artikel
- Kategori
- Search
- SEO
- Dark Mode

## V2

- Timeline Peradaban
- Relasi Tokoh
- Relasi Kitab
- Referensi Silang

## V3

- Knowledge Graph
- Visualisasi Hubungan Konsep
- AI Semantic Search
- Multi Bahasa

## V4

- AI Assistant
- Chat Knowledge Base
- Rekomendasi Artikel Otomatis

---

# 17. Prinsip Pengembangan

1. Content First

Konten lebih penting daripada fitur.

2. Static First

Gunakan solusi statis sebelum mempertimbangkan database.

3. SEO First

Setiap artikel harus dapat ditemukan mesin pencari.

4. Knowledge Graph Ready

Semua artikel harus dapat saling terhubung.

5. Long-Term Maintainability

Struktur harus tetap mudah dipelihara meskipun mencapai ribuan artikel.

---

# 18. Final Architecture

Astro

- TypeScript
- Markdown Content Collections
- JSON Metadata
- Fuse.js
- GitHub
- Cloudflare Pages

Tanpa:

- Database
- Backend API
- Dashboard Admin
- Login System

Tujuan:

Membangun ensiklopedia digital modern yang ringan, cepat, mudah dikembangkan, mudah di-backup, dan mampu menampung ribuan artikel pengetahuan lintas disiplin.
