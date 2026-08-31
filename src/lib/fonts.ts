import { Inter, Merriweather } from 'next/font/google';

/**
 * Font di-host sendiri lewat next/font, bukan `<link>` ke fonts.googleapis.com.
 *
 * Sebelumnya kedua font dimuat sebagai stylesheet lintas-domain yang memblokir
 * render, dan itu rantai dua tahap: browser harus mengambil CSS dari
 * googleapis.com dulu, baru tahu harus mengunduh file font dari gstatic.com —
 * dua kali DNS + TLS + permintaan sebelum satu huruf pun tampil. next/font
 * menyalin file fontnya ke bundel kita sendiri, jadi tidak ada domain pihak
 * ketiga di jalur kritis sama sekali.
 *
 * Nama keluarga font yang dihasilkan next/font di-hash, jadi CSS tidak bisa
 * menyebut 'Merriweather' secara harfiah. Karena itu masing-masing diekspos
 * sebagai variabel CSS, lalu `--font-display` dan `--font-body` di globals.css
 * merujuk ke variabel itu — seluruh CSS yang sudah ada tidak perlu diubah.
 */

export const merriweather = Merriweather({
  subsets: ['latin'],
  // Tanpa `weight`: Merriweather kini variable font, satu berkas melayani
  // 300-900 — termasuk bobot 500 dan 600 yang dulu dibulatkan browser.
  // Italic tidak disertakan: seluruh teks miring memakai --font-body.
  display: 'swap',
  variable: '--font-merriweather',
});

export const inter = Inter({
  subsets: ['latin'],
  // Tanpa `weight`: Inter adalah variable font, satu file melayani 300–600.
  display: 'swap',
  variable: '--font-inter',
});

/** Dipasang di <html> supaya kedua variabel tersedia untuk seluruh halaman. */
export const fontVariables = `${merriweather.variable} ${inter.variable}`;
