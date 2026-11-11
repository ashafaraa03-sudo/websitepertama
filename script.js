/* Kuis Oli — game kuis edukasi satu pemain.
   Alur: Beranda → Kategori → Persiapan → Soal ↔ Umpan balik → Hasil → Peringkat / Main lagi.
   Semua data pemain disimpan di localStorage browser ini. */
"use strict";

/* =========================================================
   1. DATA
   ========================================================= */
const ROUND = 8; // jumlah soal per permainan

const LEVELS = {
  mudah:  { name: "Mudah",  time: 20, lives: 3, mult: 1,   note: "20 detik · 3 nyawa · poin ×1" },
  sedang: { name: "Sedang", time: 15, lives: 3, mult: 1.5, note: "15 detik · 3 nyawa · poin ×1,5" },
  sulit:  { name: "Sulit",  time: 10, lives: 2, mult: 2,   note: "10 detik · 2 nyawa · poin ×2" }
};

const CATS = {
  mat:  { name: "Matematika", desc: "Berhitung, bangun datar, dan pecahan", c: "var(--sky)",   cs: "var(--sky-soft)" },
  ipa:  { name: "IPA",        desc: "Makhluk hidup, Bumi, dan antariksa",  c: "var(--grass)", cs: "var(--grass-soft)" },
  bhs:  { name: "Bahasa",     desc: "Bahasa Indonesia dan Bahasa Inggris", c: "var(--coral)", cs: "var(--coral-soft)" },
  umum: { name: "Umum",       desc: "Sejarah, geografi, dan budaya",       c: "var(--sun-deep)", cs: "var(--sun-soft)" }
};

/* Format soal: [pertanyaan, [jawaban benar, salah, salah, salah], penjelasan] */
const QUESTIONS = {
  mat: {
    mudah: [
      ["7 + 8 = …", ["15", "14", "16", "13"], "7 + 8 = 15. Coba hitung 7 + 3 = 10, lalu tambah 5 lagi."],
      ["9 × 3 = …", ["27", "24", "21", "30"], "9 × 3 artinya 9 + 9 + 9 = 27."],
      ["50 − 18 = …", ["32", "42", "38", "28"], "50 − 20 = 30, lalu tambah 2 karena kita mengurangi 2 terlalu banyak. Hasilnya 32."],
      ["Bangun datar yang punya 3 sisi disebut …", ["Segitiga", "Persegi", "Lingkaran", "Trapesium"], "Segitiga punya 3 sisi dan 3 sudut."],
      ["24 : 4 = …", ["6", "8", "5", "4"], "4 × 6 = 24, jadi 24 : 4 = 6."],
      ["Setengah dari 30 adalah …", ["15", "10", "20", "60"], "Setengah berarti dibagi 2. 30 : 2 = 15."],
      ["Angka 3.405 dibaca …", ["Tiga ribu empat ratus lima", "Tiga ribu empat puluh lima", "Tiga ratus empat puluh lima", "Tiga ribu empat ratus lima puluh"], "3 ribuan, 4 ratusan, 0 puluhan, 5 satuan: tiga ribu empat ratus lima."],
      ["1 jam sama dengan … menit", ["60", "100", "30", "24"], "1 jam = 60 menit, dan 1 menit = 60 detik."]
    ],
    sedang: [
      ["12 × 15 = …", ["180", "170", "190", "165"], "12 × 15 = 12 × 10 + 12 × 5 = 120 + 60 = 180."],
      ["KPK dari 4 dan 6 adalah …", ["12", "24", "10", "2"], "Kelipatan 4: 4, 8, 12. Kelipatan 6: 6, 12. Kelipatan persekutuan terkecilnya 12."],
      ["Luas persegi panjang dengan panjang 8 cm dan lebar 5 cm adalah …", ["40 cm²", "26 cm²", "13 cm²", "45 cm²"], "Luas = panjang × lebar = 8 × 5 = 40 cm². (26 cm² adalah kelilingnya.)"],
      ["25% dari 240 adalah …", ["60", "48", "24", "75"], "25% sama dengan seperempat. 240 : 4 = 60."],
      ["3/4 + 1/8 = …", ["7/8", "4/12", "1", "5/8"], "Samakan penyebutnya: 3/4 = 6/8. Lalu 6/8 + 1/8 = 7/8."],
      ["Manakah yang merupakan bilangan prima?", ["29", "21", "27", "33"], "29 hanya habis dibagi 1 dan 29. Sedangkan 21 = 3 × 7, 27 = 3 × 9, 33 = 3 × 11."],
      ["Jumlah ketiga sudut dalam segitiga adalah …", ["180°", "360°", "90°", "270°"], "Sudut-sudut dalam segitiga apa pun selalu berjumlah 180°."],
      ["FPB dari 18 dan 24 adalah …", ["6", "3", "12", "72"], "Faktor 18: 1, 2, 3, 6, 9, 18. Faktor 24: 1, 2, 3, 4, 6, 8, 12, 24. Faktor sama terbesar adalah 6."]
    ],
    sulit: [
      ["Jika 2x + 6 = 20, maka x = …", ["7", "13", "8", "6"], "2x = 20 − 6 = 14, jadi x = 14 : 2 = 7."],
      ["Keliling lingkaran berjari-jari 7 cm (π = 22/7) adalah …", ["44 cm", "22 cm", "154 cm", "49 cm"], "Keliling = 2 × π × r = 2 × 22/7 × 7 = 44 cm. (154 cm² adalah luasnya.)"],
      ["√144 + √81 = …", ["21", "25", "15", "225"], "√144 = 12 dan √81 = 9. Jadi 12 + 9 = 21."],
      ["Volume kubus dengan rusuk 6 cm adalah …", ["216 cm³", "36 cm³", "72 cm³", "180 cm³"], "Volume kubus = s × s × s = 6 × 6 × 6 = 216 cm³."],
      ["Rata-rata dari 6, 8, 10, dan 12 adalah …", ["9", "8", "10", "36"], "Jumlahkan dulu: 6 + 8 + 10 + 12 = 36. Lalu bagi banyak data: 36 : 4 = 9."],
      ["2³ × 3² = …", ["72", "36", "54", "48"], "2³ = 8 dan 3² = 9. Jadi 8 × 9 = 72."],
      ["Sisi miring segitiga siku-siku dengan sisi tegak 6 cm dan 8 cm adalah …", ["10 cm", "14 cm", "12 cm", "9 cm"], "Teorema Pythagoras: √(6² + 8²) = √(36 + 64) = √100 = 10 cm."],
      ["15% dari 400, lalu dikurangi 20, hasilnya …", ["40", "60", "80", "20"], "15% dari 400 = 60. Lalu 60 − 20 = 40."]
    ]
  },
  ipa: {
    mudah: [
      ["Hewan yang hanya memakan tumbuhan disebut …", ["Herbivora", "Karnivora", "Omnivora", "Insektivora"], "Herbivora pemakan tumbuhan, contohnya sapi dan kambing."],
      ["Bagian tumbuhan yang menyerap air dari tanah adalah …", ["Akar", "Daun", "Bunga", "Batang"], "Akar menyerap air dan mineral, lalu batang mengalirkannya ke seluruh tumbuhan."],
      ["Kita bernapas menggunakan organ …", ["Paru-paru", "Jantung", "Lambung", "Ginjal"], "Paru-paru mengambil oksigen dari udara dan membuang karbon dioksida."],
      ["Planet tempat kita tinggal adalah …", ["Bumi", "Mars", "Venus", "Jupiter"], "Bumi adalah planet ketiga dari Matahari."],
      ["Air yang didinginkan sampai membeku berubah menjadi …", ["Es", "Uap", "Embun", "Awan"], "Air membeku menjadi es pada suhu 0 °C."],
      ["Matahari terbit dari arah …", ["Timur", "Barat", "Utara", "Selatan"], "Bumi berputar dari barat ke timur, sehingga Matahari tampak terbit di timur."],
      ["Katak termasuk kelompok hewan …", ["Amfibi", "Reptil", "Mamalia", "Ikan"], "Amfibi bisa hidup di dua alam, di air dan di darat."],
      ["Indra untuk mencium bau adalah …", ["Hidung", "Telinga", "Lidah", "Kulit"], "Hidung adalah indra pembau."]
    ],
    sedang: [
      ["Planet terbesar di tata surya adalah …", ["Jupiter", "Saturnus", "Bumi", "Neptunus"], "Jupiter sangat besar. Lebih dari 1.000 Bumi bisa muat di dalamnya."],
      ["Fotosintesis terutama terjadi di bagian tumbuhan …", ["Daun", "Akar", "Batang", "Bunga"], "Daun mengandung klorofil (zat hijau daun) yang menangkap cahaya Matahari."],
      ["Organ yang memompa darah ke seluruh tubuh adalah …", ["Jantung", "Paru-paru", "Hati", "Ginjal"], "Jantung berdetak memompa darah lewat pembuluh darah."],
      ["Perubahan wujud dari padat langsung menjadi gas disebut …", ["Menyublim", "Mencair", "Menguap", "Mengkristal"], "Contoh menyublim: kapur barus yang lama-lama habis di lemari."],
      ["Gas yang dihasilkan tumbuhan saat fotosintesis adalah …", ["Oksigen", "Karbon dioksida", "Nitrogen", "Hidrogen"], "Tumbuhan menyerap karbon dioksida dan melepaskan oksigen yang kita hirup."],
      ["Sumber energi terbesar bagi Bumi adalah …", ["Matahari", "Bulan", "Angin", "Minyak bumi"], "Cahaya dan panas Matahari menggerakkan cuaca dan membuat tumbuhan tumbuh."],
      ["Planet yang dijuluki 'planet merah' adalah …", ["Mars", "Venus", "Merkurius", "Jupiter"], "Tanah Mars banyak mengandung besi oksida (karat) yang berwarna kemerahan."],
      ["Benda yang dapat ditarik magnet adalah …", ["Paku besi", "Penghapus karet", "Kertas", "Kayu"], "Magnet menarik benda dari besi, baja, nikel, dan kobalt."]
    ],
    sulit: [
      ["Rumus kimia air adalah …", ["H₂O", "CO₂", "O₂", "NaCl"], "Satu molekul air tersusun dari 2 atom hidrogen dan 1 atom oksigen."],
      ["Satuan gaya dalam Sistem Internasional (SI) adalah …", ["Newton", "Joule", "Watt", "Pascal"], "Gaya diukur dalam newton (N). Joule untuk energi, watt untuk daya, pascal untuk tekanan."],
      ["Gas yang paling banyak di atmosfer Bumi adalah …", ["Nitrogen", "Oksigen", "Karbon dioksida", "Argon"], "Nitrogen sekitar 78% dan oksigen sekitar 21% dari udara."],
      ["Titik didih air murni pada tekanan 1 atm adalah …", ["100 °C", "0 °C", "90 °C", "120 °C"], "Pada tekanan udara normal, air mendidih pada 100 °C dan membeku pada 0 °C."],
      ["Organel sel yang menghasilkan energi disebut …", ["Mitokondria", "Kloroplas", "Ribosom", "Nukleus"], "Mitokondria sering dijuluki 'pembangkit tenaga' sel."],
      ["Planet yang paling dekat dengan Matahari adalah …", ["Merkurius", "Venus", "Mars", "Bumi"], "Urutannya dari Matahari: Merkurius, Venus, Bumi, Mars, dan seterusnya."],
      ["Perpindahan panas tanpa zat perantara disebut …", ["Radiasi", "Konduksi", "Konveksi", "Isolasi"], "Contoh radiasi: panas Matahari sampai ke Bumi melewati ruang hampa."],
      ["Sel darah merah dapat mengangkut oksigen karena mengandung …", ["Hemoglobin", "Trombosit", "Plasma", "Leukosit"], "Hemoglobin mengikat oksigen dan memberi warna merah pada darah."]
    ]
  },
  bhs: {
    mudah: [
      ["Lawan kata 'besar' adalah …", ["Kecil", "Tinggi", "Luas", "Panjang"], "Besar berlawanan dengan kecil."],
      ["Persamaan kata 'pandai' adalah …", ["Pintar", "Malas", "Lambat", "Ramah"], "Pandai dan pintar memiliki arti yang sama."],
      ["'Apple' dalam bahasa Indonesia adalah …", ["Apel", "Jeruk", "Pisang", "Anggur"], "Apple = apel. Orange = jeruk, banana = pisang, grape = anggur."],
      ["Manakah yang termasuk huruf vokal?", ["A", "B", "K", "S"], "Huruf vokal ada lima: a, i, u, e, o."],
      ["'Kucing' dalam bahasa Inggris adalah …", ["Cat", "Dog", "Bird", "Fish"], "Cat = kucing, dog = anjing, bird = burung, fish = ikan."],
      ["Kalimat yang diakhiri tanda tanya (?) disebut kalimat …", ["Tanya", "Perintah", "Berita", "Seru"], "Kalimat tanya dipakai untuk bertanya dan diakhiri tanda tanya."],
      ["Lawan kata 'naik' adalah …", ["Turun", "Masuk", "Datang", "Maju"], "Naik berlawanan dengan turun."],
      ["'Good morning' artinya …", ["Selamat pagi", "Selamat malam", "Selamat tidur", "Sampai jumpa"], "Good morning = selamat pagi, good night = selamat malam/tidur."]
    ],
    sedang: [
      ["Lawan kata 'rajin' adalah …", ["Malas", "Tekun", "Giat", "Ulet"], "Tekun, giat, dan ulet adalah persamaan kata rajin. Lawannya malas."],
      ["Manakah penulisan kata yang baku?", ["Apotek", "Apotik", "Resiko", "Nasehat"], "Bentuk bakunya: apotek, risiko, nasihat."],
      ["Bentuk lampau (past tense) dari 'go' adalah …", ["Went", "Goed", "Gone", "Going"], "Go adalah kata kerja tak beraturan: go – went – gone."],
      ["Bentuk jamak dari 'child' adalah …", ["Children", "Childs", "Childes", "Childrens"], "Child (satu anak) menjadi children (banyak anak)."],
      ["Puisi lama 4 baris bersajak a-b-a-b dengan sampiran dan isi disebut …", ["Pantun", "Gurindam", "Syair", "Soneta"], "Pantun: baris 1–2 sampiran, baris 3–4 isi, rima a-b-a-b."],
      ["Kata dasar 'sapu' mendapat awalan me- menjadi …", ["Menyapu", "Mensapu", "Mesapu", "Mengsapu"], "Huruf s di awal kata dasar luluh menjadi ny: me- + sapu = menyapu."],
      ["She ___ to school every day.", ["goes", "go", "going", "gone"], "Subjek she/he/it pada kalimat kebiasaan memakai kata kerja + s/es: goes."],
      ["Manakah penulisan yang benar?", ["di rumah", "dirumah", "di-rumah", "dirumah-rumah"], "'Di' sebagai kata depan yang menunjukkan tempat ditulis terpisah: di rumah."]
    ],
    sulit: [
      ["Kalimat 'Angin berbisik di telingaku' mengandung majas …", ["Personifikasi", "Hiperbola", "Metafora", "Litotes"], "Personifikasi memberi sifat manusia (berbisik) pada benda mati (angin)."],
      ["Teks yang berisi ajakan atau bujukan kepada pembaca disebut teks …", ["Persuasi", "Narasi", "Deskripsi", "Prosedur"], "Teks persuasi bertujuan membujuk pembaca, misalnya iklan dan poster ajakan."],
      ["Bentuk perbandingan (comparative) dari 'good' adalah …", ["Better", "Gooder", "Best", "More good"], "Good – better – best adalah bentuk tak beraturan."],
      ["How ___ water do you drink every day?", ["much", "many", "long", "often"], "Water tidak bisa dihitung satu per satu, jadi memakai 'much'."],
      ["Unsur cerita yang berupa tempat, waktu, dan suasana disebut …", ["Latar", "Alur", "Tokoh", "Amanat"], "Latar menjelaskan di mana, kapan, dan dalam suasana apa cerita terjadi."],
      ["They have ___ their homework.", ["finished", "finish", "finishing", "finishes"], "Present perfect memakai have + kata kerja bentuk ketiga: have finished."],
      ["Paragraf yang kalimat utamanya terletak di awal disebut paragraf …", ["Deduktif", "Induktif", "Campuran", "Naratif"], "Deduktif: dari umum (kalimat utama) ke khusus. Induktif kebalikannya."],
      ["I was born ___ 2014.", ["in", "on", "at", "by"], "Untuk tahun dan bulan kita memakai 'in'. 'On' untuk tanggal dan hari."]
    ]
  },
  umum: {
    mudah: [
      ["Lambang negara Indonesia adalah …", ["Garuda Pancasila", "Harimau", "Elang Jawa", "Komodo"], "Garuda Pancasila dengan semboyan Bhinneka Tunggal Ika."],
      ["Hari Kemerdekaan Indonesia diperingati setiap tanggal …", ["17 Agustus", "1 Juni", "28 Oktober", "2 Mei"], "Proklamasi kemerdekaan dibacakan pada 17 Agustus 1945."],
      ["Warna bendera Indonesia adalah …", ["Merah dan putih", "Merah dan kuning", "Putih dan biru", "Merah dan hijau"], "Bendera Sang Saka Merah Putih: merah di atas, putih di bawah."],
      ["Satu minggu terdiri dari … hari", ["7", "5", "6", "10"], "Senin sampai Minggu ada 7 hari."],
      ["Hewan purba yang hidup di Pulau Komodo adalah …", ["Komodo", "Orangutan", "Badak bercula satu", "Anoa"], "Komodo adalah kadal terbesar di dunia, hidup di Nusa Tenggara Timur."],
      ["Alat untuk mengetahui waktu adalah …", ["Jam", "Termometer", "Kompas", "Penggaris"], "Termometer mengukur suhu, kompas menunjukkan arah, penggaris mengukur panjang."],
      ["Lagu kebangsaan Indonesia adalah …", ["Indonesia Raya", "Halo-Halo Bandung", "Tanah Airku", "Hari Merdeka"], "Indonesia Raya diciptakan oleh W.R. Supratman."],
      ["Pelangi memiliki … warna", ["7", "5", "6", "9"], "Mejikuhibiniu: merah, jingga, kuning, hijau, biru, nila, ungu."]
    ],
    sedang: [
      ["Sumpah Pemuda diikrarkan pada tanggal …", ["28 Oktober 1928", "17 Agustus 1945", "20 Mei 1908", "10 November 1945"], "Para pemuda berikrar satu tanah air, satu bangsa, dan menjunjung bahasa persatuan."],
      ["Benua terluas di dunia adalah …", ["Asia", "Afrika", "Amerika", "Eropa"], "Asia adalah benua terluas dan berpenduduk paling banyak."],
      ["Gunung tertinggi di Indonesia adalah …", ["Puncak Jaya", "Semeru", "Kerinci", "Rinjani"], "Puncak Jaya di Papua tingginya sekitar 4.884 meter."],
      ["Mata uang negara Jepang adalah …", ["Yen", "Won", "Yuan", "Baht"], "Won (Korea Selatan), yuan (Tiongkok), baht (Thailand)."],
      ["Samudra terluas di dunia adalah …", ["Samudra Pasifik", "Samudra Hindia", "Samudra Atlantik", "Samudra Arktik"], "Samudra Pasifik lebih luas dari seluruh daratan di Bumi digabung."],
      ["Candi Borobudur terletak di provinsi …", ["Jawa Tengah", "Jawa Timur", "DI Yogyakarta", "Bali"], "Borobudur ada di Magelang, Jawa Tengah, dekat perbatasan Yogyakarta."],
      ["Bunyi sila ketiga Pancasila adalah …", ["Persatuan Indonesia", "Ketuhanan Yang Maha Esa", "Kemanusiaan yang adil dan beradab", "Keadilan sosial bagi seluruh rakyat Indonesia"], "Sila ketiga dilambangkan pohon beringin."],
      ["Danau terbesar di Indonesia adalah …", ["Danau Toba", "Danau Sentani", "Danau Poso", "Danau Maninjau"], "Danau Toba di Sumatra Utara terbentuk dari letusan gunung api purba."]
    ],
    sulit: [
      ["ASEAN didirikan pada tahun …", ["1967", "1945", "1955", "1975"], "ASEAN berdiri 8 Agustus 1967 di Bangkok, Thailand."],
      ["Proklamator kemerdekaan Indonesia adalah …", ["Soekarno dan Mohammad Hatta", "Soekarno dan Sutan Sjahrir", "Hatta dan Ki Hajar Dewantara", "Soedirman dan Soekarno"], "Soekarno dan Mohammad Hatta menandatangani teks proklamasi."],
      ["Garis khayal yang membagi Bumi menjadi belahan utara dan selatan disebut …", ["Khatulistiwa", "Garis bujur", "Meridian", "Garis balik"], "Khatulistiwa (ekuator) berada di lintang 0°. Kota Pontianak dilalui garis ini."],
      ["Menurut PBB, negara dengan jumlah penduduk terbanyak sejak 2023 adalah …", ["India", "Tiongkok", "Amerika Serikat", "Indonesia"], "Pada 2023 India melampaui Tiongkok. Indonesia berada di urutan keempat."],
      ["Tokoh yang dijuluki Bapak Pendidikan Nasional adalah …", ["Ki Hajar Dewantara", "Dr. Soetomo", "R.A. Kartini", "Mohammad Hatta"], "Ki Hajar Dewantara mendirikan Taman Siswa. Hari lahirnya, 2 Mei, menjadi Hari Pendidikan Nasional."],
      ["Selat yang memisahkan Pulau Jawa dan Pulau Sumatra adalah …", ["Selat Sunda", "Selat Bali", "Selat Makassar", "Selat Malaka"], "Selat Sunda berada di antara Banten dan Lampung."],
      ["Kegiatan menghasilkan atau menambah nilai guna barang disebut …", ["Produksi", "Konsumsi", "Distribusi", "Investasi"], "Produksi membuat barang, distribusi menyalurkan, konsumsi memakai."],
      ["Organisasi Budi Utomo berdiri pada tanggal …", ["20 Mei 1908", "28 Oktober 1928", "17 Agustus 1945", "10 November 1945"], "Tanggal berdirinya Budi Utomo diperingati sebagai Hari Kebangkitan Nasional."]
    ]
  }
};

const BADGES = [
  { id: "pertama",  e: "🎉", name: "Langkah Pertama",  desc: "Selesaikan permainan pertamamu" },
  { id: "sempurna", e: "💯", name: "Nilai Sempurna",   desc: "Jawab benar semua 8 soal" },
  { id: "kilat",    e: "⚡", name: "Secepat Kilat",    desc: "Jawab benar dalam 3 detik" },
  { id: "beruntun", e: "🔥", name: "Lima Beruntun",    desc: "5 jawaban benar berturut-turut" },
  { id: "mandiri",  e: "🧠", name: "Tanpa Bantuan",    desc: "Raih 2 bintang tanpa memakai bantuan" },
  { id: "tangguh",  e: "💪", name: "Pantang Menyerah", desc: "Selesaikan 8 soal dengan sisa 1 nyawa" },
  { id: "sulit",    e: "🏔️", name: "Penakluk Sulit",   desc: "Raih 3 bintang di tingkat Sulit" },
  { id: "rajin",    e: "📚", name: "Rajin Berlatih",   desc: "Main sebanyak 5 kali" },
  { id: "mat",      e: "🧮", name: "Jago Hitung",      desc: "Raih 3 bintang di Matematika" },
  { id: "ipa",      e: "🔬", name: "Ilmuwan Cilik",    desc: "Raih 3 bintang di IPA" },
  { id: "bhs",      e: "✍️", name: "Pujangga Muda",    desc: "Raih 3 bintang di Bahasa" },
  { id: "umum",     e: "🌏", name: "Serba Tahu",       desc: "Raih 3 bintang di Umum" }
];

const AVATARS = ["🦊", "🐼", "🐯", "🐸", "🐧", "🐨", "🐙", "🦁"];

/* Pemain contoh di papan peringkat (week = skor terbaik minggu ini, null bila tidak main) */
const SAMPLE_PLAYERS = [
  { name: "Bima",  av: "🐯", all: 2280, week: 1890 },
  { name: "Rina",  av: "🐼", all: 2150, week: 1410 },
  { name: "Ayu",   av: "🐧", all: 1960, week: 1620 },
  { name: "Dodi",  av: "🐸", all: 1720, week: null },
  { name: "Fajar", av: "🦁", all: 1540, week: 1180 },
  { name: "Sari",  av: "🐨", all: 1380, week: null },
  { name: "Putri", av: "🦊", all: 1210, week: 990 },
  { name: "Rizky", av: "🐙", all: 1050, week: null },
  { name: "Galih", av: "🐼", all: 920,  week: 640 },
  { name: "Nadia", av: "🐧", all: 760,  week: null }
];

const LINES = {
  hello: ["Siap jadi juara hari ini?", "Yuk, belajar sambil main!", "Aku sudah menunggumu!"],
  prep:  ["Tarik napas, kamu pasti bisa!", "Baca soalnya pelan-pelan, ya!", "Ayo kumpulkan tiga bintang!", "Semangat! Aku menemanimu."],
  right: ["Hebat!", "Tepat sekali!", "Kamu keren!", "Mantap!", "Luar biasa!"],
  wrong: ["Tidak apa-apa, kita belajar bersama!", "Hampir! Ayo coba di soal berikutnya.", "Jangan menyerah, ya!", "Salah itu bagian dari belajar."],
  late:  ["Waktunya habis! Lain kali lebih cepat, ya.", "Tidak apa-apa, ayo lanjut!"]
};

/* =========================================================
   2. UTILITAS
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const fmt = n => n.toLocaleString("id-ID");

function load(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; } }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

const NEW_PROFILE = { name: "", avatar: "🦊", xp: 0, games: 0, stars: 0, best: 0, badges: {}, bestStars: {}, history: [] };
const freshProfile = () => Object.assign({}, NEW_PROFILE, { badges: {}, bestStars: {}, history: [] });
let P = Object.assign(freshProfile(), load("kuisoli-profile", {}));
const saveProfile = () => save("kuisoli-profile", P);
let soundOn = load("kuisoli-sound", true);
let lastDiff = load("kuisoli-diff", "mudah");
if (!LEVELS[lastDiff]) lastDiff = "mudah";

function levelInfo(xp) {
  let lv = 1, need = 100, rest = xp;
  while (rest >= need) { rest -= need; lv++; need = 100 + (lv - 1) * 50; }
  return { lv, into: rest, need };
}

let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2400);
}

/* =========================================================
   3. SUARA (Web Audio, tanpa file)
   ========================================================= */
let ac = null;
function tone(freq, dur, type = "triangle", when = 0, vol = 0.12) {
  if (!soundOn) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + when;
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
  } catch (e) {}
}
const sfx = {
  click() { tone(660, 0.06, "square", 0, 0.05); },
  count() { tone(520, 0.18, "square", 0, 0.08); },
  go()    { tone(784, 0.12, "square"); tone(1047, 0.3, "square", 0.1); },
  right() { [659, 784, 988, 1319].forEach((f, i) => tone(f, 0.16, "triangle", i * 0.08)); tone(1568, 0.35, "sine", 0.32, 0.08); },
  wrong() { tone(330, 0.2, "sawtooth", 0, 0.07); tone(247, 0.4, "sawtooth", 0.18, 0.07); },
  tick()  { tone(1200, 0.04, "sine", 0, 0.06); },
  power() { [523, 698, 880].forEach((f, i) => tone(f, 0.1, "sine", i * 0.06)); },
  fanfare() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.22, "triangle", i * 0.12)); }
};

/* =========================================================
   4. GAMBAR (maskot Oli, ikon)
   ========================================================= */
const INK = "#1D2B4F";
function oli(mood = "hi", cls = "") {
  const W = (x, rot, extra = "") => `<ellipse cx="${x}" cy="80" rx="10" ry="22" fill="var(--owl)" stroke="${INK}" stroke-width="3" transform="rotate(${rot} ${x < 60 ? 28 : 92} 62)" ${extra}/>`;
  let wings;
  if (mood === "cheer") wings = W(22, 135) + W(98, -135);
  else if (mood === "hi") wings = W(22, 12) + `<g class="wave">${W(98, -135)}</g>`;
  else if (mood === "sad") wings = W(22, -4) + W(98, 4);
  else wings = W(22, 12) + W(98, -12);

  const disk = `<circle cx="44" cy="52" r="18" fill="var(--owl-face)"/><circle cx="76" cy="52" r="18" fill="var(--owl-face)"/>`;
  let eyes;
  if (mood === "cheer") {
    eyes = disk + `<path d="M34 56q10-12 20 0M66 56q10-12 20 0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  } else {
    const [dx, dy] = mood === "sad" ? [0, 4] : mood === "think" ? [4, -4] : [0, 0];
    eyes = disk +
      `<circle cx="44" cy="52" r="13" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="76" cy="52" r="13" fill="#fff" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="${44 + dx}" cy="${52 + dy}" r="6.5" fill="${INK}"/><circle cx="${76 + dx}" cy="${52 + dy}" r="6.5" fill="${INK}"/>` +
      `<circle cx="${46 + dx}" cy="${50 + dy}" r="2" fill="#fff"/><circle cx="${78 + dx}" cy="${50 + dy}" r="2" fill="#fff"/>`;
    if (mood === "sad") eyes += `<path d="M30 40l16-7M90 40l-16-7" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  }
  const cheeks = mood === "sad" ? "" : `<circle cx="29" cy="68" r="5" fill="var(--berry)" opacity=".35"/><circle cx="91" cy="68" r="5" fill="var(--berry)" opacity=".35"/>`;
  return `<svg class="oli ${cls}" viewBox="0 0 120 122" role="img" aria-label="Oli si burung hantu">
    <path d="M26 42L30 10L48 28Z M94 42L90 10L72 28Z" fill="var(--owl)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="60" cy="68" rx="40" ry="44" fill="var(--owl)" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="60" cy="88" rx="24" ry="21" fill="var(--owl-belly)"/>
    <path d="M50 83q4 4 8 0M62 83q4 4 8 0M56 93q4 4 8 0" stroke="var(--owl)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    ${wings}${eyes}${cheeks}
    <path d="M54 62l6 10 6-10z" fill="var(--sun)" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M46 111v6M52 111v6M68 111v6M74 111v6" stroke="var(--sun-deep)" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

const ICON = {
  mat: `<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="5" width="38" height="38" rx="10" fill="var(--paper)" stroke="${INK}" stroke-width="3"/><path d="M14 17h10M19 12v10M28 17h8M14 30l7 7M21 30l-7 7M28 31h8M28 36h8" stroke="var(--sky)" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  ipa: `<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M21 6v13L10 37a4 4 0 0 0 3.5 6h21a4 4 0 0 0 3.5-6L27 19V6z" fill="var(--paper)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M14.5 31h19L38 37a4 4 0 0 1-3.5 6h-21a4 4 0 0 1-3.5-6z" fill="var(--grass)"/><path d="M21 6v13L10 37a4 4 0 0 0 3.5 6h21a4 4 0 0 0 3.5-6L27 19V6M18 6h12" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="22" cy="25" r="2" fill="var(--grass)"/><circle cx="26" cy="20" r="1.5" fill="var(--grass)"/></svg>`,
  bhs: `<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M8 9h32a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H22l-9 8v-8H8a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3z" fill="var(--paper)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><text x="24" y="28.5" text-anchor="middle" font-family="Baloo 2, Trebuchet MS, sans-serif" font-weight="800" font-size="16" fill="var(--coral)">Aa</text></svg>`,
  umum: `<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="var(--paper)" stroke="${INK}" stroke-width="3"/><path d="M14 12c4 3 2 7 6 8s4 5 1 8-1 7-4 7M30 8c-1 4 3 6 6 5M34 26c3 0 5 3 4 6" fill="none" stroke="var(--sun-deep)" stroke-width="3" stroke-linecap="round"/><ellipse cx="24" cy="24" rx="18" ry="18" fill="none" stroke="${INK}" stroke-width="3"/></svg>`
};
const STAR = (fill = "var(--sun)") => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.6 6 21l1.3-6.8-5-4.7 6.8-.8z" fill="${fill}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const HEART = cls => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--coral)" stroke="${INK}" stroke-width="1.6"/></svg>`;
const ARROW = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const BACK = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const miniStars = n => `<span class="mini-stars" aria-label="${n} bintang">${[0, 1, 2].map(i => STAR(i < n ? "var(--sun)" : "var(--muted)")).join("")}</span>`;

/* =========================================================
   5. BILAH ATAS & NAVIGASI
   ========================================================= */
const screen = $("#screen");
let current = "home";

function renderTopbar() {
  const L = levelInfo(P.xp);
  $("#goProfile").innerHTML = `
    <span class="av">${P.avatar}</span>
    <span class="meta"><span class="nm">${esc(P.name || "Pemain baru")}</span>
      <span class="lv">Lv ${L.lv} <span class="xpbar"><i style="width:${Math.round((L.into / L.need) * 100)}%"></i></span></span></span>`;
  const sb = $("#soundBtn");
  sb.setAttribute("aria-pressed", soundOn);
  sb.setAttribute("aria-label", soundOn ? "Suara nyala" : "Suara mati");
}
$("#brandMark").innerHTML = oli("idle");
$("#goHome").onclick = () => { if (confirmLeave()) go("home"); };
$("#goProfile").onclick = () => { if (confirmLeave()) go("profile"); };
$("#soundBtn").onclick = () => { soundOn = !soundOn; save("kuisoli-sound", soundOn); renderTopbar(); sfx.click(); };

let leaveArmed = false;
function confirmLeave() {
  if (current !== "play" && current !== "prep") return true;
  if (leaveArmed) { leaveArmed = false; stopGame(); return true; }
  leaveArmed = true; toast("Tekan sekali lagi untuk keluar dari permainan");
  setTimeout(() => (leaveArmed = false), 2500);
  return false;
}

function go(name, arg) {
  current = name;
  window.scrollTo({ top: 0 });
  ({ home: renderHome, cats: renderCats, prep: renderPrep, play: renderQuestion, result: renderResult, board: renderBoard, profile: renderProfile, help: renderHelp })[name](arg);
  renderTopbar();
}

/* =========================================================
   LAYAR 1 — BERANDA
   ========================================================= */
function renderHome() {
  const greet = P.name ? `Halo, ${esc(P.name)}! ${pick(LINES.hello)}` : "Halo! Aku Oli. Siapa namamu?";
  screen.innerHTML = `
    <section class="card home">
      <div class="mascot"><div class="bubble">${greet}</div>${oli("hi", "bob")}</div>
      <div class="home-main">
        <h1 class="wordmark" aria-label="Kuis Oli"><span>K</span><span>U</span><span>I</span><span>S</span><br><span>O</span><span>L</span><span>I</span></h1>
        <p class="tagline">Belajar sambil main. Jawab soal, kumpulkan bintang, dan raih lencana!</p>
        ${P.name ? "" : `<div class="name-field"><label class="label" for="homeName">Nama kamu</label><input type="text" id="homeName" maxlength="16" placeholder="Tulis namamu di sini" autocomplete="off"></div>`}
        <div><button class="btn primary big" id="startBtn" type="button">Mulai Main ${ARROW}</button></div>
        <div class="row">
          <button class="btn sun" id="toBoard" type="button">Peringkat</button>
          <button class="btn" id="toHelp" type="button">Cara Bermain</button>
          <button class="btn" id="toProfile" type="button">Profil</button>
        </div>
        <div class="home-stats">
          <span class="chip">${STAR()} ${fmt(P.stars)} bintang</span>
          <span class="chip">🏅 ${Object.keys(P.badges).length}/${BADGES.length} lencana</span>
          <span class="chip">🎮 ${fmt(P.games)} kali main</span>
        </div>
      </div>
    </section>`;
  $("#startBtn").onclick = () => {
    const nf = $("#homeName");
    if (nf) { P.name = nf.value.trim() || "Pemain"; saveProfile(); }
    sfx.click(); go("cats");
  };
  const nf = $("#homeName");
  if (nf) nf.addEventListener("keydown", e => { if (e.key === "Enter") $("#startBtn").click(); });
  $("#toBoard").onclick = () => go("board");
  $("#toHelp").onclick = () => go("help");
  $("#toProfile").onclick = () => go("profile");
}

/* =========================================================
   LAYAR 2 — PILIH KATEGORI & TINGKAT
   ========================================================= */
function renderCats() {
  screen.innerHTML = `
    <button class="back" id="back" type="button">${BACK} Beranda</button>
    <div class="screen-head">
      <div><h2 class="title">Pilih kategori</h2><p class="sub">Tentukan tingkat kesulitan dulu, lalu ketuk kategori favoritmu.</p></div>
    </div>
    <div class="diff" role="group" aria-label="Tingkat kesulitan">
      ${Object.entries(LEVELS).map(([k, l]) => `<button type="button" data-d="${k}" aria-pressed="${k === lastDiff}"><b>${l.name}</b><small>${l.note}</small></button>`).join("")}
    </div>
    <div class="cats">
      ${Object.entries(CATS).map(([k, c]) => `
        <button class="cat" type="button" data-c="${k}" style="--c:${c.c};--cs:${c.cs}">
          ${ICON[k]}
          <h3>${c.name}</h3>
          <p>${c.desc}</p>
          <span class="go">${miniStars(P.bestStars[k + "-" + lastDiff] || 0)}<span class="arrow">${ARROW}</span></span>
        </button>`).join("")}
    </div>`;
  $("#back").onclick = () => go("home");
  $$("[data-d]").forEach(b => b.onclick = () => { lastDiff = b.dataset.d; save("kuisoli-diff", lastDiff); sfx.click(); renderCats(); });
  $$("[data-c]").forEach(b => b.onclick = () => { sfx.click(); newGame(b.dataset.c, lastDiff); go("prep"); });
}

/* =========================================================
   PERMAINAN — STATE
   ========================================================= */
let G = null;
function newGame(cat, diff) {
  const L = LEVELS[diff];
  G = {
    cat, diff, L,
    qs: shuffle(QUESTIONS[cat][diff]).slice(0, ROUND),
    i: 0, lives: L.lives, score: 0, correct: 0, streak: 0, maxStreak: 0,
    used: { fifty: false, time: false, skip: false }, fast: false, finished: false,
    phase: "prep", raf: 0, q: null
  };
}
function stopGame() {
  if (!G) return;
  G.phase = "stopped"; cancelAnimationFrame(G.raf); clearTimeout(G.countTimer);
  $(".overlay")?.remove();
}

/* =========================================================
   LAYAR 3 — PERSIAPAN (hitung mundur)
   ========================================================= */
function renderPrep() {
  const c = CATS[G.cat], L = G.L;
  screen.innerHTML = `
    <section class="card prep">
      <div class="mascot"><div class="bubble">${pick(LINES.prep)}</div>${oli("cheer", "bob")}</div>
      <div class="prep-right">
        <p class="label">${c.name} · ${L.name}</p>
        <div class="count pop" id="count" aria-live="assertive">3</div>
        <div class="rules">
          <span class="chip">📝 ${ROUND} soal</span>
          <span class="chip">⏱️ ${L.time} detik per soal</span>
          <span class="chip">${HEART("")} ${L.lives} nyawa</span>
          <span class="chip">✨ 3 bantuan</span>
        </div>
        <button class="btn" id="cancel" type="button">Batal</button>
      </div>
    </section>`;
  $("#cancel").onclick = () => { stopGame(); go("cats"); };
  let n = 3; sfx.count();
  const step = () => {
    if (G.phase !== "prep") return;
    n--;
    const el = $("#count"); if (!el) return;
    el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
    if (n > 0) { el.textContent = n; sfx.count(); G.countTimer = setTimeout(step, 850); }
    else if (n === 0) { el.textContent = "Mulai!"; el.classList.add("go-word"); sfx.go(); G.countTimer = setTimeout(step, 700); }
    else { G.phase = "q"; go("play"); }
  };
  G.countTimer = setTimeout(step, 850);
}

/* =========================================================
   LAYAR 4 — SOAL  (+ LAYAR 6 — BANTUAN)
   ========================================================= */
function heartsHTML(breakIdx = -1) {
  return `<span class="hearts" aria-label="${G.lives} nyawa tersisa">${Array.from({ length: G.L.lives }, (_, k) =>
    HEART(k === breakIdx ? "breaking" : k >= G.lives ? "lost" : "")).join("")}</span>`;
}
function renderQuestion() {
  const raw = G.qs[G.i];
  const order = shuffle([0, 1, 2, 3]);
  G.q = { text: raw[0], opts: order.map(k => raw[1][k]), correct: order.indexOf(0), explain: raw[2], hidden: [] };
  G.phase = "q";
  G.base = G.L.time; G.barMax = G.L.time;
  G.qStart = performance.now(); G.deadline = G.qStart + G.L.time * 1000; G.lastSec = null;

  const c = CATS[G.cat];
  screen.innerHTML = `
    <section class="play">
      <div class="hud">
        <div class="hud-left">${heartsHTML()}</div>
        <div class="hud-right"><span class="chip">${c.name} · ${G.L.name}</span><span class="chip score-chip" id="score">${fmt(G.score)}</span></div>
      </div>
      <div class="timebar"><div class="track"><div class="fill" id="tfill"></div></div><span class="sec" id="tsec">${G.L.time}</span></div>
      <div class="card qcard">
        <span class="qnum">Soal ${G.i + 1} dari ${G.qs.length}</span>
        <h2 class="question">${esc(G.q.text)}</h2>
      </div>
      <div class="answers" id="answers">
        ${G.q.opts.map((o, k) => `<button class="ans" type="button" data-a="${k}"><span class="k">${"ABCD"[k]}</span><span>${esc(o)}</span></button>`).join("")}
      </div>
      <div class="powers">
        <button class="power" id="pwFifty" type="button" ${G.used.fifty ? "disabled" : ""}><span class="pi">50:50</span>Hapus 2 jawaban</button>
        <button class="power" id="pwTime" type="button" ${G.used.time ? "disabled" : ""}><span class="pi">+10</span>Tambah waktu</button>
        <button class="power" id="pwSkip" type="button" ${G.used.skip ? "disabled" : ""}><span class="pi">${ARROW}</span>Lewati soal</button>
      </div>
      <p class="keyhint">Tekan <kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd> untuk menjawab · Bantuan hanya bisa dipakai sekali per permainan</p>
    </section>`;
  $$("[data-a]").forEach(b => b.onclick = () => answer(+b.dataset.a));
  $("#pwFifty").onclick = useFifty;
  $("#pwTime").onclick = useTime;
  $("#pwSkip").onclick = useSkip;
  tickLoop();
}
function tickLoop() {
  if (!G || G.phase !== "q") return;
  const left = Math.max(0, (G.deadline - performance.now()) / 1000);
  G.left = left;
  const fill = $("#tfill"), sec = $("#tsec");
  if (fill) {
    fill.style.transform = `scaleX(${left / G.barMax})`;
    const ratio = left / G.base;
    fill.classList.toggle("warn", ratio <= 0.5 && ratio > 0.25);
    fill.classList.toggle("danger", ratio <= 0.25);
    const s = Math.ceil(left);
    if (s !== G.lastSec) { sec.textContent = s; if (s <= 3 && s > 0) sfx.tick(); G.lastSec = s; }
    sec.classList.toggle("danger", s <= 3);
  }
  if (left <= 0) { answer(-1); return; }
  G.raf = requestAnimationFrame(tickLoop);
}
function useFifty() {
  if (G.phase !== "q" || G.used.fifty) return;
  G.used.fifty = true; sfx.power();
  G.q.hidden = shuffle([0, 1, 2, 3].filter(k => k !== G.q.correct)).slice(0, 2);
  G.q.hidden.forEach(k => { const b = $(`[data-a="${k}"]`); b.classList.add("gone"); b.disabled = true; });
  $("#pwFifty").disabled = true;
}
function useTime() {
  if (G.phase !== "q" || G.used.time) return;
  G.used.time = true; sfx.power();
  G.deadline += 10000; G.barMax = Math.max(G.base, G.left + 10);
  $("#pwTime").disabled = true; toast("+10 detik!");
}
function useSkip() {
  if (G.phase !== "q" || G.used.skip) return;
  G.used.skip = true; sfx.power(); cancelAnimationFrame(G.raf);
  G.phase = "skip"; toast("Soal dilewati");
  next();
}

/* =========================================================
   LAYAR 5 — UMPAN BALIK
   ========================================================= */
function answer(k) {
  if (!G || G.phase !== "q") return;
  cancelAnimationFrame(G.raf);
  G.phase = "fb";
  const ok = k === G.q.correct;
  const elapsed = (performance.now() - G.qStart) / 1000;
  let gain = 0, breakIdx = -1;

  if (ok) {
    gain = Math.round((100 + 50 * Math.min(1, G.left / G.base)) * G.L.mult);
    G.score += gain; G.correct++; G.streak++; G.maxStreak = Math.max(G.maxStreak, G.streak);
    if (elapsed <= 3) G.fast = true;
    sfx.right();
  } else {
    G.streak = 0; G.lives--; breakIdx = G.lives;
    sfx.wrong();
  }

  // tandai pilihan
  $$("[data-a]").forEach(b => {
    const i = +b.dataset.a; b.disabled = true;
    if (i === G.q.correct) b.classList.add("right");
    else if (i === k) b.classList.add("wrong");
    else b.classList.add("dim");
  });
  $$(".power").forEach(b => (b.disabled = true));
  $(".hud-left").innerHTML = heartsHTML(breakIdx);
  $("#score").textContent = fmt(G.score);

  const last = G.lives <= 0 || G.i >= G.qs.length - 1;
  const title = ok ? pick(LINES.right) : k === -1 ? "Waktu habis!" : "Belum tepat";
  const say = ok ? "" : (k === -1 ? pick(LINES.late) : pick(LINES.wrong));
  const right = `${"ABCD"[G.q.correct]}. ${esc(G.q.opts[G.q.correct])}`;
  const ov = document.createElement("div");
  ov.className = "overlay";
  ov.innerHTML = `
    <div class="card sheet ${ok ? "ok" : "no"}" role="dialog" aria-modal="true" aria-labelledby="vd">
      ${oli(ok ? "cheer" : "sad", ok ? "jump" : "")}
      <div class="sheet-body">
        <h3 class="verdict" id="vd">${title}</h3>
        ${ok ? `<p class="points">+${fmt(gain)} poin${G.streak >= 2 ? ` · ${G.streak} benar beruntun!` : ""}</p>`
             : `<p><b>${say}</b></p><p>Jawaban yang tepat: <b>${right}</b></p>${G.lives > 0 ? `<p>Nyawa tersisa: ${G.lives}</p>` : `<p><b>Nyawamu habis.</b></p>`}`}
        <div class="explain"><b>Tahukah kamu?</b>${esc(G.q.explain)}</div>
      </div>
      <button class="btn ${ok ? "primary" : "sky"}" id="nextBtn" type="button">${last ? "Lihat hasil" : "Lanjut"} ${ARROW}</button>
      <div class="burst" id="burst"></div>
    </div>`;
  document.body.appendChild(ov);
  if (ok) burst($("#burst"));
  const nb = $("#nextBtn"); nb.focus({ preventScroll: true });
  nb.onclick = () => { ov.remove(); next(); };
}
function burst(el) {
  for (let n = 0; n < 16; n++) {
    const s = document.createElement("span");
    s.className = "spark";
    const a = (n / 16) * Math.PI * 2, d = 80 + Math.random() * 80;
    s.style.setProperty("--x", Math.cos(a) * d + "px");
    s.style.setProperty("--y", Math.sin(a) * d + "px");
    s.style.animationDelay = Math.random() * 0.12 + "s";
    s.style.color = pick(["var(--sun)", "var(--sun)", "var(--coral)", "var(--sky)"]);
    s.innerHTML = STAR("currentColor");
    el.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
}
function next() {
  if (G.lives <= 0 || G.i >= G.qs.length - 1) { G.finished = G.lives > 0; go("result"); return; }
  G.i++; go("play");
}

/* =========================================================
   LAYAR 7 — HASIL AKHIR
   ========================================================= */
function starsFor(correct) {
  const r = correct / ROUND;
  return r >= 0.85 ? 3 : r >= 0.6 ? 2 : correct >= 1 ? 1 : 0;
}
function renderResult() {
  G.phase = "done";
  const stars = starsFor(G.correct);
  const before = levelInfo(P.xp);

  // perbarui profil
  P.games++; P.stars += stars; P.best = Math.max(P.best, G.score);
  const key = G.cat + "-" + G.diff;
  P.bestStars[key] = Math.max(P.bestStars[key] || 0, stars);
  P.history.push({ score: G.score, cat: G.cat, diff: G.diff, stars, date: Date.now() });
  if (P.history.length > 200) P.history = P.history.slice(-200);

  const usedAny = G.used.fifty || G.used.time || G.used.skip;
  const cond = {
    pertama: true,
    sempurna: G.correct === ROUND,
    kilat: G.fast,
    beruntun: G.maxStreak >= 5,
    mandiri: !usedAny && stars >= 2,
    tangguh: G.finished && G.lives === 1 && G.L.lives > 1,
    sulit: G.diff === "sulit" && stars === 3,
    rajin: P.games >= 5,
    [G.cat]: stars === 3
  };
  const earned = BADGES.filter(b => cond[b.id] && !P.badges[b.id]);
  earned.forEach(b => (P.badges[b.id] = Date.now()));

  const xpGain = Math.floor(G.score / 10) + stars * 10 + earned.length * 20;
  P.xp += xpGain;
  saveProfile();
  const after = levelInfo(P.xp);
  const levelUp = after.lv > before.lv;

  const head = stars === 3 ? "Luar biasa!" : stars === 2 ? "Bagus sekali!" : stars === 1 ? "Kerja bagus!" : "Ayo coba lagi!";
  const say = G.lives <= 0 ? "Nyawamu habis, tapi kamu sudah berusaha. Coba lagi, ya!" :
    stars === 3 ? "Kamu juara! Aku bangga sekali." : stars === 2 ? "Sedikit lagi tiga bintang!" : "Setiap latihan membuatmu makin pintar.";
  const c = CATS[G.cat];

  screen.innerHTML = `
    <section class="card result">
      <div class="mascot"><div class="bubble">${say}</div>${oli(stars >= 2 ? "cheer" : "hi", "bob")}</div>
      <div class="result-main">
        <p class="label">${c.name} · ${G.L.name}</p>
        <h2 class="title">${head}</h2>
        <div class="big-stars" aria-label="${stars} dari 3 bintang">${[0, 1, 2].map(k => STAR(k < stars ? "var(--sun)" : "var(--muted)")).join("")}</div>
        <p class="final-score">${fmt(G.score)}<small>poin</small></p>
        <div class="stats">
          <div class="stat"><b>${G.correct}/${ROUND}</b><span>jawaban benar</span></div>
          <div class="stat"><b>${G.maxStreak}</b><span>benar beruntun</span></div>
          <div class="stat"><b>${Math.max(0, G.lives)}</b><span>nyawa tersisa</span></div>
        </div>
        <div class="xp-line">
          <div class="row" style="justify-content:space-between"><b>+${xpGain} XP${levelUp ? ` · Naik ke Level ${after.lv}! 🎊` : ""}</b><span class="note">Level ${after.lv} · ${after.into}/${after.need} XP</span></div>
          <div class="xptrack"><i id="xpfill" style="width:${levelUp ? 0 : Math.round((before.into / before.need) * 100)}%"></i></div>
        </div>
        ${earned.length ? `<div><p class="label" style="margin-bottom:6px">Lencana baru</p><div class="new-badges">${earned.map((b, i) => `<span class="nb" style="animation-delay:${0.7 + i * 0.15}s"><span class="e">${b.e}</span>${b.name}</span>`).join("")}</div></div>` : ""}
        <div class="row">
          <button class="btn primary" id="again" type="button">Main Lagi</button>
          <button class="btn sun" id="toBoard" type="button">Lihat Peringkat</button>
          <button class="btn" id="toCats" type="button">Ganti Kategori</button>
        </div>
      </div>
    </section>`;
  requestAnimationFrame(() => requestAnimationFrame(() => { const f = $("#xpfill"); if (f) f.style.width = Math.round((after.into / after.need) * 100) + "%"; }));
  if (stars >= 2) sfx.fanfare();
  if (levelUp) setTimeout(() => toast(`Selamat! Kamu naik ke Level ${after.lv}`), 900);
  const cat = G.cat, diff = G.diff;
  $("#again").onclick = () => { newGame(cat, diff); go("prep"); };
  $("#toBoard").onclick = () => go("board");
  $("#toCats").onclick = () => go("cats");
}

/* =========================================================
   LAYAR 8 — PAPAN PERINGKAT
   ========================================================= */
let boardPeriod = "week";
function renderBoard() {
  const WEEK = 7 * 864e5, now = Date.now();
  const mine = P.history.filter(h => boardPeriod === "all" || now - h.date < WEEK).reduce((m, h) => Math.max(m, h.score), 0);
  const rows = SAMPLE_PLAYERS
    .filter(s => boardPeriod === "all" || s.week)
    .map(s => ({ name: s.name, av: s.av, score: boardPeriod === "all" ? s.all : s.week, me: false }));
  if (mine > 0) rows.push({ name: P.name || "Kamu", av: P.avatar, score: mine, me: true });
  rows.sort((a, b) => b.score - a.score);
  const top = rows.slice(0, 3), rest = rows.slice(3);
  const order = [top[1], top[0], top[2]].filter(Boolean);
  const place = r => rows.indexOf(r) + 1;

  screen.innerHTML = `
    <button class="back" id="back" type="button">${BACK} Beranda</button>
    <div class="screen-head">
      <div><h2 class="title">Papan peringkat</h2><p class="sub">Skor terbaik dalam satu permainan.</p></div>
      <div class="tabs" role="group" aria-label="Periode">
        <button type="button" data-p="week" aria-pressed="${boardPeriod === "week"}">Mingguan</button>
        <button type="button" data-p="all" aria-pressed="${boardPeriod === "all"}">Semua waktu</button>
      </div>
    </div>
    <div class="card board-wrap">
      <div class="podium-box">
        <div class="podium">${order.map(r => `
          <div class="pod p${place(r)} ${r.me ? "me" : ""}">
            <span class="av">${r.av}</span><span class="pn">${esc(r.name)}${r.me ? " (Kamu)" : ""}</span><span class="ps">${fmt(r.score)}</span>
            <div class="blk">${place(r)}</div>
          </div>`).join("")}</div>
      </div>
      <div class="ranklist">
        ${rest.map(r => `<div class="rk ${r.me ? "me" : ""}"><span class="n">${place(r)}</span><span class="av">${r.av}</span><span class="nm">${esc(r.name)}</span><span class="sc">${fmt(r.score)}</span></div>`).join("")}
        ${mine ? "" : `<div class="rk me"><span class="n">–</span><span class="av">${P.avatar}</span><span class="nm">${esc(P.name || "Kamu")}</span><span class="sc">Belum ada skor</span></div>`}
      </div>
    </div>
    <div class="row" style="justify-content:space-between">
      <p class="note">Selain kamu, nama di papan ini adalah pemain contoh. Skormu tersimpan di browser ini.</p>
      <button class="btn primary" id="play" type="button">Main sekarang ${ARROW}</button>
    </div>`;
  $("#back").onclick = () => go("home");
  $("#play").onclick = () => go("cats");
  $$("[data-p]").forEach(b => b.onclick = () => { boardPeriod = b.dataset.p; sfx.click(); renderBoard(); });
}

/* =========================================================
   LAYAR 9 — PROFIL & HADIAH
   ========================================================= */
function renderProfile() {
  const L = levelInfo(P.xp);
  const got = Object.keys(P.badges).length;
  screen.innerHTML = `
    <button class="back" id="back" type="button">${BACK} Beranda</button>
    <div class="profile">
      <section class="card pcard">
        <div class="row"><span class="avatar-big" id="avBig">${P.avatar}</span>
          <div style="flex:1;min-width:160px;display:flex;flex-direction:column;gap:6px">
            <label class="label" for="pname">Nama</label>
            <input type="text" id="pname" maxlength="16" value="${esc(P.name)}" placeholder="Tulis namamu">
          </div></div>
        <div><p class="label" style="margin-bottom:8px">Pilih avatar</p>
          <div class="avatars">${AVATARS.map(a => `<button type="button" data-av="${a}" aria-pressed="${a === P.avatar}" aria-label="Avatar ${a}">${a}</button>`).join("")}</div></div>
        <div class="lvl">
          <div class="lvl-badge"><div><small>Level</small><span>${L.lv}</span></div></div>
          <div class="xp-line" style="flex:1;min-width:0"><b>${fmt(P.xp)} XP total</b>
            <div class="xptrack"><i style="width:${Math.round((L.into / L.need) * 100)}%"></i></div>
            <span class="note">${L.need - L.into} XP lagi menuju Level ${L.lv + 1}</span></div>
        </div>
        <div class="stats">
          <div class="stat"><b>${fmt(P.games)}</b><span>kali main</span></div>
          <div class="stat"><b>${fmt(P.stars)}</b><span>total bintang</span></div>
          <div class="stat"><b>${fmt(P.best)}</b><span>skor terbaik</span></div>
        </div>
        <button class="btn" id="reset" type="button">Hapus semua progres</button>
      </section>
      <section class="card pcard">
        <div class="screen-head"><h2 class="title" style="font-size:30px">Koleksi lencana</h2><span class="chip">🏅 ${got}/${BADGES.length}</span></div>
        <div class="badges">${BADGES.map(b => `
          <div class="badge ${P.badges[b.id] ? "" : "locked"}">
            <span class="e">${b.e}</span><b>${b.name}</b><small>${P.badges[b.id] ? "Didapat " + new Date(P.badges[b.id]).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : b.desc}</small>
          </div>`).join("")}</div>
      </section>
    </div>`;
  $("#back").onclick = () => go("home");
  $("#pname").oninput = e => { P.name = e.target.value.trim(); saveProfile(); renderTopbar(); };
  $$("[data-av]").forEach(b => b.onclick = () => { P.avatar = b.dataset.av; saveProfile(); sfx.click(); renderProfile(); renderTopbar(); });
  let armed = false;
  $("#reset").onclick = e => {
    if (!armed) { armed = true; e.target.textContent = "Yakin? Tekan lagi untuk menghapus"; setTimeout(() => { armed = false; if (e.target.isConnected) e.target.textContent = "Hapus semua progres"; }, 3000); return; }
    P = freshProfile(); saveProfile(); toast("Progres dihapus"); go("home");
  };
}

/* =========================================================
   CARA BERMAIN
   ========================================================= */
function renderHelp() {
  screen.innerHTML = `
    <button class="back" id="back" type="button">${BACK} Beranda</button>
    <section class="card help">
      <div style="display:flex;flex-direction:column;gap:18px;min-width:0">
        <h2 class="title">Cara bermain</h2>
        <ol class="steps">
          <li><div><b>Pilih tingkat dan kategori</b><span>Mudah, Sedang, atau Sulit. Lalu pilih Matematika, IPA, Bahasa, atau Umum.</span></div></li>
          <li><div><b>Bersiap</b><span>Oli menghitung mundur 3-2-1. Setiap permainan berisi ${ROUND} soal.</span></div></li>
          <li><div><b>Jawab sebelum waktu habis</b><span>Ketuk jawaban atau tekan A, B, C, D. Makin cepat menjawab, makin banyak poin.</span></div></li>
          <li><div><b>Jaga nyawamu</b><span>Jawaban salah atau waktu habis mengurangi satu nyawa. Nyawa habis, permainan selesai.</span></div></li>
          <li><div><b>Pakai bantuan dengan cerdik</b><span>50:50, tambah 10 detik, dan lewati soal. Masing-masing hanya sekali per permainan.</span></div></li>
          <li><div><b>Kumpulkan bintang dan lencana</b><span>7–8 benar = 3 bintang, 5–6 benar = 2 bintang. Poin juga menambah XP untuk naik level.</span></div></li>
        </ol>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
        <div class="mascot"><div class="bubble">Kalau salah, baca penjelasannya, ya!</div>${oli("think", "bob")}</div>
        <div style="overflow-x:auto">
          <table class="dtable">
            <thead><tr><th>Tingkat</th><th>Waktu</th><th>Nyawa</th><th>Poin</th></tr></thead>
            <tbody>${Object.values(LEVELS).map(l => `<tr><td><b>${l.name}</b></td><td>${l.time} dtk</td><td>${l.lives}</td><td>×${String(l.mult).replace(".", ",")}</td></tr>`).join("")}</tbody>
          </table>
        </div>
        <button class="btn primary" id="play" type="button">Ayo main! ${ARROW}</button>
      </div>
    </section>`;
  $("#back").onclick = () => go("home");
  $("#play").onclick = () => go("cats");
}

/* =========================================================
   KEYBOARD
   ========================================================= */
document.addEventListener("keydown", e => {
  if (!G || e.target.matches("input, textarea") || e.repeat) return;
  if (current === "play" && G.phase === "q") {
    const k = "ABCD".indexOf(e.key.toUpperCase());
    const n = "1234".indexOf(e.key);
    const i = k >= 0 ? k : n;
    if (i >= 0 && !G.q.hidden.includes(i)) answer(i);
  }
});

/* Mulai */
go("home");
