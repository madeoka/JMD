# BETONLAB — Job Mix Design Beton Normal (SNI Indonesia)

**Aplikasi web statis** untuk rancangan awal campuran beton normal dengan dua metode perhitungan terpisah. Antarmuka berbahasa Indonesia, responsif, dan seluruh kalkulasi berjalan lokal di browser. Tidak perlu database, server backend, framework, token API, atau koneksi internet untuk menghitung.

> **Peringatan rekayasa:** hasil adalah desain campuran awal (*preliminary mix design*), bukan persetujuan JMD produksi. Data sifat fisik material harus berasal dari pengujian, batas durabilitas proyek perlu diperiksa, lalu dilakukan *trial mix* dan pengujian mutu oleh personel kompeten.

## Fitur

- **SNI 7656:2012** — pendekatan volume absolut, tabel kebutuhan air, rasio air-semen, kandungan udara, fraksi agregat kasar, dan pasir dari neraca volume.
- **SNI 03-2834-1993 (historis/pembelajaran)** — pendekatan berat isi beton, target kuat tekan, kebutuhan air bebas, lingkungan, dan hasil **pembacaan grafik yang dimasukkan secara manual**.
- Perhitungan per **1 m³** dan kuantitas **batch**, dengan koreksi kelembaban dan absorpsi agregat dari kondisi SSD ke kondisi lapangan.
- Tabel dan grafik gradasi pasir–kerikil pada metode 1993, termasuk dua versi data bahan ajar yang berbeda (C.1 dan C.3).
- Ekspor hasil CSV, impor/ekspor JSON, cetak laporan (pilih *Save as PDF* pada browser).
- Tidak menggunakan pelacakan, analitik pihak ketiga, atau penyimpanan proyek di server.

## Menggunakan aplikasi

**Online melalui GitHub Pages**: setelah deployment berhasil, buka URL pada bagian **Deployments / github-pages** atau menu `Settings → Pages`. Bentuk URL untuk nama repositori biasa:

`https://USERNAME.github.io/NAMA-REPO/`

**Offline**: unduh repository dan buka file `index.html` dengan Chrome, Edge, atau Firefox modern.

## Cara upload ke GitHub dan publikasi GitHub Pages

1. Buat repositori GitHub baru, misalnya `betonlab-jobmix-design`. Pilih **Public** jika ingin situs terbuka bagi umum. Jangan menambahkan README otomatis karena sudah ada di paket.
2. Ekstrak ZIP, kemudian unggah **isi folder** ke akar repository (bukan file ZIP-nya). Pastikan folder tersembunyi `.github/workflows/` ikut masuk ke repository.
3. Pilih branch default **`main`**. Jika GitHub membuat nama branch lain, ubah nama branch menjadi `main` atau sesuaikan `branches: [main]` pada file workflow.
4. Buka `Settings → Pages → Build and deployment → Source → GitHub Actions`.
5. Buka tab `Actions` dan pastikan workflow **Deploy BETONLAB to GitHub Pages** berhasil. Aplikasi akan dipublikasikan dan alamat URL situs tersedia di bagian deployment.
6. Setiap perubahan yang di-*push* ke branch `main` akan menjalankan pemeriksaan perhitungan, kemudian memublikasikan versi terbaru otomatis.

### Alternatif upload menggunakan terminal (Git)

Jalankan di dalam folder hasil ekstraksi:

```bash
git init
git branch -M main
git add .
git commit -m "Initial release: BETONLAB v2.0"
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

Ganti `USERNAME` dan `NAMA-REPO` dengan akun dan nama repositori sebenarnya. Jika diperlukan, autentikasi GitHub melalui browser / credential manager.

## Struktur folder

```text
BETONLAB_GitHub_Ready/
├── index.html                  # Semua UI, CSS, dan mesin perhitungan
├── examples/
│   └── Contoh_20MPa_SNI1993.json
├── tests/
│   └── calculations.test.cjs  # Regression tests; Node.js built-in test runner
├── .github/workflows/
│   ├── deploy.yml             # GitHub Pages automatic deployment
│   └── tests.yml              # Pull-request checks
├── .nojekyll
├── .gitignore
├── package.json               # npm test, tanpa dependensi
├── LICENSE
└── README.md
```

## Menjalankan pengujian

Dengan Node.js 20 atau lebih baru:

```bash
npm test
```

Pengujian mencakup reproduksi angka contoh beton 20 MPa, neraca massa SSD–lapangan, keseimbangan volume absolut untuk metode 7656:2012, proteksi input lingkungan khusus, dan pemeriksaan aplikasi statis tanpa dependensi CDN.

## Contoh acuan: perencanaan f'c = 20 MPa

Dari PDF *Mix desain beton* yang diberikan pengguna: target `f'cr = 30 MPa`, FAS desain `0,508`, air bebas `205 kg/m³`, kadar semen setelah pembulatan `404 kg/m³`, pasir SSD `741,72 kg/m³`, batu pecah SSD `1.024,28 kg/m³`, dan air setelah koreksi kadar air `≈199,01 kg/m³`.

Pilih metode **1993**, lalu klik tombol **Contoh PDF: f'c 20 MPa**; atau gunakan `Impor JSON` dengan file dalam `examples/`.

**Perbedaan data bahan ajar:** data gradasi awal Tabel C.1 berbeda dari gradasi yang tercantum pada Tabel C.3 (PDF hal. 2 dan 10); dua versi ditampilkan sebagai pilihan eksplisit, tidak digabung diam-diam. Grafik standar tidak didigitasi penuh; masukkan hasil pembacaan grafik dari dokumen sah.

## Rujukan dan pembatasan metode

1. [SNI 7656:2012 — Tata cara pemilihan campuran beton](https://pesta.bsn.go.id/produk/detail/9094-sni76562012).
2. **SNI 03-2834-1993** — *Tata Cara Pembuatan Rencana Campuran Beton Normal* (PDF referensi pengguna; historis).
3. **Mix desain beton** — bahan ajar dengan contoh SNI 03-2834-1993 (PDF referensi pengguna).
4. [SNI 03-2834-2000 — Tata cara pembuatan rencana campuran beton normal](https://pesta.bsn.go.id/produk/detail/3197-sni03-2834-2000) (tidak diimplementasikan sebagai mesin hitung tersendiri).
5. [SNI 2847:2019 — Persyaratan beton struktural](https://pesta.bsn.go.id/produk/detail/12731-sni28472019), sebagai rujukan pemeriksaan kondisi paparan dan spesifikasi desain.

**Jangan menyamakan perhitungan 1993 dengan kepatuhan terhadap edisi 2000.** SNI 1993 disediakan untuk mereplikasi bahan ajar dan mempelajari metode historis; pengguna harus memeriksa ketentuan terbaru untuk produksi.

**PDF SNI dan bahan ajar tidak disertakan di repository.** Lisensi perangkat lunak (MIT) hanya untuk kode aplikasi yang dibuat, **bukan** untuk teks, grafik standar, buku, atau dokumen pihak ketiga. Sebelum rilis publik, perbarui baris hak cipta pada `LICENSE` sesuai pemilik perangkat lunak yang dikehendaki.

## Privasi

Semua data dihitung di perangkat pengguna. Data input proyek tidak dikirim ke GitHub oleh aplikasi ketika kalkulator dioperasikan. GitHub Pages hanya menayangkan file statis aplikasi; saat membuka situs, permintaan web biasa tetap diproses oleh penyedia hosting.

## Lisensi

Lihat [LICENSE](LICENSE). MIT untuk kode asli aplikasi saja.
