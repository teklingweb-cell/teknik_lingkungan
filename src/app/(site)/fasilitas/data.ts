/**
 * Daftar peralatan tiga laboratorium utama.
 *
 * Disalin dari LKPS TL - 14 Agustus 2026, sheet 5a (Prasarana dan Peralatan
 * Utama). Dibangkitkan dari berkasnya, bukan diketik ulang, agar tidak ada
 * nama alat yang salah salin. Halaman sebelumnya memajang peralatan yang
 * tidak pernah ada — GCMS Agilent, Flow Cytometer BD FACSAria — beserta luas
 * ruang dan kapasitas peneliti yang juga dikarang.
 */
export type Alat = { nama: string; jumlah: number | null };

export type Lab = {
  key: string;
  nomor: string;
  nama: string;
  ringkas: string;
  deskripsi: string;
  alat: Alat[];
};

export const LABS: Lab[] = [
  {
    key: 'kimia',
    nomor: 'Lab 01',
    nama: 'Laboratorium Analisis Kualitas Lingkungan',
    ringkas: 'Analisis Kualitas Lingkungan',
    deskripsi:
      'Tempat pengujian mutu air, air limbah, dan limbah padat secara fisika-kimia. Dilengkapi rangkaian titrasi, inkubator BOD, jartest enam spindle untuk uji koagulasi-flokulasi, serta tanur dan oven untuk analisis gravimetri padatan. Dipakai untuk praktikum Kimia Lingkungan, Pengolahan Air Minum, dan pengujian sampel penelitian mahasiswa maupun dosen.',
    alat: [
      { nama: 'Batang Pengaduk', jumlah: 12 },
      { nama: 'Botol Semprot', jumlah: 14 },
      { nama: 'Botol Winkler', jumlah: 28 },
      { nama: 'Bulb', jumlah: 15 },
      { nama: 'Bunsen', jumlah: 15 },
      { nama: 'Buret', jumlah: 8 },
      { nama: 'Cawan Gooch', jumlah: 9 },
      { nama: 'Cawan Petri', jumlah: 60 },
      { nama: 'Cawan Porselen', jumlah: 6 },
      { nama: 'Corong Buchner', jumlah: 6 },
      { nama: 'Corong Kaca', jumlah: 13 },
      { nama: 'Desikator', jumlah: 3 },
      { nama: 'Erlenmeyer', jumlah: 29 },
      { nama: 'Furnace', jumlah: 1 },
      { nama: 'Galon aquadest', jumlah: 1 },
      { nama: 'Gelas Beaker', jumlah: 55 },
      { nama: 'Gelas Ukur', jumlah: 29 },
      { nama: 'Hot plate', jumlah: 1 },
      { nama: 'Inkubator BOD', jumlah: 2 },
      { nama: 'Jartest 6 spindle', jumlah: 2 },
      { nama: 'Kaca Arloji', jumlah: 12 },
      { nama: 'Labu ukur', jumlah: 154 },
      { nama: 'Mortar & alu', jumlah: 4 },
      { nama: 'Neraca/timbangan digital', jumlah: 2 },
      { nama: 'Neraca Analitik', jumlah: 1 },
      { nama: 'Oven', jumlah: 1 },
      { nama: 'Penjepit Kayu', jumlah: 7 },
      { nama: 'pH meter', jumlah: 5 },
      { nama: 'Pipet Tetes', jumlah: 75 },
      { nama: 'Pipet Ukur', jumlah: 19 },
      { nama: 'Pipet Volume', jumlah: 6 },
      { nama: 'Pompa Vakum', jumlah: 2 },
      { nama: 'Rak Tabung Reaksi', jumlah: 13 },
      { nama: 'Spatula', jumlah: 4 },
      { nama: 'Statif', jumlah: 6 },
      { nama: 'Tabung Reaksi', jumlah: 82 },
      { nama: 'TDS dan EC Meter', jumlah: 5 },
      { nama: 'Thermometer Alkohol', jumlah: 10 },
    ],
  },
  {
    key: 'mikrobiologi',
    nomor: 'Lab 02',
    nama: 'Laboratorium Mikrobiologi Lingkungan',
    ringkas: 'Mikrobiologi Lingkungan',
    deskripsi:
      'Ruang kerja aseptis untuk pengujian mikrobiologi air dan lingkungan. Autoklaf, Laminar Air Flow, dan inkubator mendukung sterilisasi serta kultur mikroba, sementara tabung Durham dan rangkaian tabung reaksi dipakai untuk uji total coliform dengan metode MPN. Menjadi penopang praktikum Mikrobiologi Lingkungan dan riset biodegradasi.',
    alat: [
      { nama: 'Autoklaf', jumlah: 1 },
      { nama: 'Batang Pengaduk', jumlah: 18 },
      { nama: 'Batang Penyebar', jumlah: 8 },
      { nama: 'Botol semprot', jumlah: 5 },
      { nama: 'Bulb', jumlah: 12 },
      { nama: 'Bunsen', jumlah: 28 },
      { nama: 'Cawan Petri', jumlah: 150 },
      { nama: 'Drying Oven', jumlah: 1 },
      { nama: 'Erlenmeyer', jumlah: 31 },
      { nama: 'Gelas Beaker', jumlah: 26 },
      { nama: 'Gelas Objek', jumlah: 600 },
      { nama: 'Gelas Ukur', jumlah: 13 },
      { nama: 'Incubator', jumlah: 1 },
      { nama: 'Jarum Ose', jumlah: 19 },
      { nama: 'Kaca Arloji', jumlah: 10 },
      { nama: 'Kulkas', jumlah: 1 },
      { nama: 'Laminar Air Flow (LAF)', jumlah: 1 },
      { nama: 'Magnetic Stirrer', jumlah: 2 },
      { nama: 'Mikropipet', jumlah: 11 },
      { nama: 'Tabung Durham', jumlah: 506 },
      { nama: 'Tabung Reaksi', jumlah: 220 },
      { nama: 'Pinset', jumlah: 10 },
      { nama: 'Pipet Tetes', jumlah: 243 },
      { nama: 'Pipet Ukur', jumlah: 34 },
      { nama: 'Rak tabung reaksi', jumlah: 22 },
      { nama: 'Shaker Platform', jumlah: 1 },
      { nama: 'Spatula', jumlah: 17 },
      { nama: 'Tabung CO2', jumlah: 1 },
      { nama: 'Thermometer Alkohol', jumlah: 1 },
    ],
  },
  {
    key: 'udara',
    nomor: 'Lab 03',
    nama: 'Laboratorium Udara',
    ringkas: 'Kualitas Udara',
    deskripsi:
      'Perangkat pengukuran kualitas udara ambien dan emisi, sebagian besar bersifat portabel sehingga dapat dibawa langsung ke lokasi pengambilan sampel. Impinger dipakai untuk menjerap gas pencemar, dust collector untuk partikulat, sedangkan CO meter, anemometer, dan environmental meter merekam parameter gas dan meteorologi di lapangan.',
    alat: [
      { nama: 'CO Meter', jumlah: 2 },
      { nama: 'Anemometer', jumlah: 2 },
      { nama: 'Dust Collector', jumlah: 3 },
      { nama: 'Impinger', jumlah: 1 },
      { nama: 'PCE Instruments Environmental Meter', jumlah: 1 },
    ],
  },
];
